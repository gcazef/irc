var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// Socket setup
var io = socket(server);

// Listen to connection event
io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    //handlers 
    var join = (channel) => { socket.join(channel); console.log("joined room", channel); }

    var leave = (channel) => { socket.leave(channel); }

    var isTyping = (name) => { socket.broadcast.emit("typing", name); }

    var msgHandler = (message) => { io.sockets.emit("chat-message", message); }

    // Listen to the chat message
    socket.on("chat-message", msgHandler);
    // See who is typing
    socket.on("typing", isTyping);
    // User joins rooms
    socket.on("join", join);
    // User leaves room
    socket.on("leave", leave);
    // User creates room
    socket.on("create-room", join);
});
