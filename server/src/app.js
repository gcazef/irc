// Dependancies
var express = require("express");
var socket = require("socket.io");
var cors = require("cors");
var bodyParser = require("body-parser");

// Routes
var Users = require("../routes/Users");

// Models
var User = require("../models/User");
var Channel = require("../models/Channel");
var Message = require("../models/Message");
var db = require("../database/db");

// Change force: true not to drop db everytime
db.sequelize.sync();

const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200
};
cors({credentials: true, origin: true});

// App setup
var app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", Users);

var server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// Socket setup
var io = socket(server);

io.on("connection", (socket) => {
    var uname = "";

    console.log('new connection');

    var sendRoomEvent = (type, message, data) => {
        var event = {
            type: type,
            message: message,
            data: data
        };
        
        if (type === "new") {
            io.emit("room-event", event);
        } else {
            io.emit("room-event", event);
        }
    };

    var sendUserEvent = (type, data) => {
        var event = {
            type: type,
            data: data
        };
        socket.emit("user-event", event);
    };

    var getUserName = (users, id) => {
        var name = "";
        users.forEach(user => {
            if (user.id == id) {
                name = user.name;
            }
        });
        return name;
    };

    var formatMessages = (messages, users) => {
        var readables = [];

        messages.forEach(msg => {
            var userName = getUserName(users, msg.user);
            var readable = {
                user: userName,
                content: msg.content,
                date: msg.date
            }
            readables.push(readable);
        });
        return readables;
    };

    // User events
    socket.on("change-uname", (name) => {
        uname = name;
    });

    socket.on("get-users", () => {
        var members = [];

        User.findAll().then(users => {
            users.forEach(user => {
                members.push(user.name);
            });
            io.emit("members", members);
        });
    });

    // Chat events
    socket.on("chat-message", (content, room) => {
        var date = new Date();

        User.findAll({
            where: { name: uname }
        }).then(users => {
            Channel.findAll({
                where: { name: room }
            }).then(channels => {
                return {user: users[0], channel: channels[0]};
            }).then(data => {
                Message.create({
                    content: content,
                    date: date,
                    user: data.user.id,
                    channel: data.channel.id
                }).then(message => {
                    io.in(room).emit("chat-message", { content: content, 
                                                        date: date,
                                                        user: uname,
                                                        channel: room});
                }).catch(err => {
                    console.log("CHAT" + err);
                });
            }).catch(err => {
                console.log("CHAT: " + err);
            });
        }).catch(err => {
            console.log("CHAT: " + err);
        });
    });

    // Room events
    socket.on("get-rooms", () => {
        Channel.findAll({
            attributes: ["name"]
        }).then(channels => {
            socket.emit("get-rooms", channels);
        })
    });

    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("create-room", (channel) => {
        console.log("new room");

        Channel.create({name: channel.valueOf()})
            .then(chan => {
                sendRoomEvent("new", "channel created", {channel: chan.name});
            }).catch(err => {
                console.log("CREATE" + err);
            });
    });

    // delete
    socket.on("delete-room", (channel) => {
        console.log("delete room");

        Channel.destroy({where: {name: channel.valueOf()}, truncate: false})
            .then(chan => {
                sendRoomEvent("delete", "channel deleted", {channel: chan.name});
            }).catch(err => {
                console.log("DELETE" + err);
            });
    });
    
    // edit
    socket.on("update-room", (oldName, newName) => {
        console.log("update room");
        Channel.update({name: newName.valueOf()}, {where: {name: oldName.valueOf()}})
        .then(chan => {
            sendRoomEvent("update", "channel updated", {channel: chan.name});
        }).catch(err => {
            console.log("UPDATE" + err);
        });
    });

    socket.on("join", (room) => {
        User.findAll().then(users => {
            Channel.findAll({
                where: { name: room }
            }).then(channels => {
                return {users: users, channel: channels[0]};
            }).then(data => {
                Message.findAll({
                    where: { channel: data.channel.id }
                }).then(messages => {
                    var msg = uname + " joined room " + room;
                    var readables = formatMessages(messages, data.users);

                    sendRoomEvent("join", msg, {channel: data.channel.name});
                    sendUserEvent("join", {channel: data.channel.name, messages: readables});
                    socket.join(data.channel.name);
                }).catch(err => {
                    console.log("CHAT" + err);
                    console.log(err.stack);
                });
            }).catch(err => {
                console.log("CHAT: " + err);
                console.log(err.stack);

            });
        }).catch(err => {
            console.log("CHAT: " + err);
            console.log(err.stack);

        });
    });

    socket.on("leave", (channel) => {
        var msg = uname + " left channel " + channel;

        sendRoomEvent("leave", msg, {channel: channel});
        socket.leave(channel);
    });
});
