var express = require('express');
var socket = require('socket.io');
var cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  };
var bodyParser = require('body-parser')
cors({credentials: true, origin: true})


// App setup

var app = express();
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }))
var Users = require("../routes/Users")
app.use("/", Users);
var server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// Socket setup
var io = socket(server);

// Listen to connection event
io.on("connection", (socket) => {
    var joinedRooms = [];
    var uname = "";

    console.log("New socket connection:", socket.id);

    var sendRoomEvent = (type, room, msg) => {
        var data = {
            type: type,
            room: room,
            message: msg
        };
        io.in(room).emit("room-event", data);
    };

    socket.on("change-uname", (name) => {
        uname = name;
    });

    // Listen to the chat message
    socket.on("chat-message", (content, room) => {
        var date = new Date(Date.now());
        var data = {
            user: uname,
            room: room,
            date: date.toLocaleString(),
            content: content
        };
        io.in(room).emit("chat-message", data);
        console.log("emitted");
    });
    // See who is typing
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });
    // User joins rooms
    socket.on("join", (channel) => {
        if (!joinedRooms.includes(channel)) {
            var msg = uname + " joined channel " + channel;

            socket.join(channel);
            joinedRooms.push(channel);
            sendRoomEvent("join", channel, msg);
            console.log("joined rooms", joinedRooms);
        }
    });
    // User leaves room
    socket.on("leave", (channel) => {
        var roomIdx = joinedRooms.indexOf(channel);

        if (roomIdx != -1) {
            var msg = uname + " left channel " + channel;

            socket.leave(channel);
            joinedRooms.splice(roomIdx, 1);
            sendRoomEvent("leave", channel, msg);
            console.log("left room", channel);
        }
    });
    // User creates room
    socket.on("create-room", (channel) => {
        console.log("new room");
        var data = {
            type: "new",
            room: channel,
            message: ""
        };

        io.emit("room-event", data);
    });
});

var Users = require ('../routes/Users')

app.use('../users', Users)