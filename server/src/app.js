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
db.sequelize.sync({force: true});

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
    var joinedRooms = [];
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
            io.in(data.channel).emit("room-event", event);
        }
    };

    var sendUserEvent = (type, data) => {
        var event = {
            type: type,
            data: data
        };
        socket.emit("user-event", event);
    };

    // User events
    socket.on("change-uname", (name) => {
        uname = name;
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
                    console.log(message);
                    console.log( content + uname  + room + date);
                    io.in(room).emit("chat-message", { content: content, 
                                                        date: date,
                                                        user: uname,
                                                        channel: room});
                }).catch(err => {
                    console.log("CHAT" + err);
                });
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
    // edit

    socket.on("join", (channel) => {
        if (!joinedRooms.includes(channel)) {
            Message.findAll({
                include: [{
                    model: Channel,
                    where: { name: channel }
                }]
            }).then(messages => {
                var msg = uname + " joined room " + channel;
                sendRoomEvent("join", msg, {channel: channel});
                sendUserEvent("join", {channel: channel, messages: messages});
                socket.join(channel);
                joinedRooms.push(channel);
            }).catch(err => {
                console.log("JOIN" + err);
            });
        }
    });

    socket.on("leave", (channel) => {
        var roomIdx = joinedRooms.indexOf(channel);
        var msg = uname + " left channel " + channel;

        if (roomIdx != -1) {
            sendRoomEvent("leave", msg, {channel: channel});
            socket.leave(channel);
            joinedRooms.splice(roomIdx, 1);
        }
    });
});
