// Dependancies
var express = require("express");
var socket = require("socket.io");
var cors = require("cors");
var bodyParser = require("body-parser");

// Models
var Users = require("../routes/Users");
var User = require("../models/User");
var Channel = require("../models/Channel");
var Message = require("../models/Message");

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

    var sendRoomEvent = (type, room, msg, content) => {
        var data = {
            type: type,
            room: room,
            message: msg,
            content: content
        };
        io.in(room).emit("room-event", data);
    };

    var sendMessages = (roomId, room) => {
        Message.findAll({
            where: {
                channel: roomId
            }
        }).then(messages => {
            var msg = data.name + " joined channel " + data.room;
            sendRoomEvent("join", room, msg, messages);
        }).catch(err => {
            console.log(err);
        });
    };

    var saveMessage = (roomId, data) => {
        User.findAll({
            attributes: ["id"],
            where: {
                name: data.user
            }
        }).then(user => {
            Message.create({
                content: data.content,
                date: data.date,
                user: user[0].id,
                channel: roomId
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
        
    }

    // User events
    socket.on("change-uname", (name) => {
        uname = name;
    });

    // Chat events
    socket.on("chat-message", (content, room) => {
        var date = new Date(Date.now());
        var data = {
            user: uname,
            room: room,
            date: date.toLocaleString(),
            content: content
        };
        Channel.findAll({
                attributes: ["id"],
                where: {
                    name: room
                }
            }).then(chan => {
                    saveMessage(chan[0].id, data);
                })
                .catch(err => {
                    console.log(err);
                })

        io.in(room).emit("chat-message", data);
        console.log("emitted");
    });

    // Room events
    socket.on("get-rooms", () => {
        Channel.findAll({
            attributes: ["name"]
        }).then(channels => {
            socket.emit("rooms-list", channels);
        })
    });

    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("join", (channel) => {
        if (!joinedRooms.includes(channel)) {
            
            Channel.findAll({
                attributes: ["id"],
                where: {
                    name: channel
                }
            }).then(chan => {
                    sendMessages(chan[0].id, channel);
                })
                .catch(err => {
                    console.log(err);
                })

            socket.join(channel);
            joinedRooms.push(channel);
            console.log("joined rooms", joinedRooms);
        }
    });

    socket.on("leave", (channel) => {
        var roomIdx = joinedRooms.indexOf(channel);

        if (roomIdx != -1) {
            var msg = uname + " left channel " + channel;

            socket.leave(channel);
            joinedRooms.splice(roomIdx, 1);
            sendRoomEvent("leave", channel, msg, []);
            console.log("left room", channel);
        }
    });

    socket.on("create-room", (channel) => {
        console.log("new room");
        var data = {
            type: "new",
            room: channel,
            message: ""
        };

        Channel.create({name: channel})
            .catch(err => {
                console.log(err);
            });
        io.emit("room-event", data);
    });
});
