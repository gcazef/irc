var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// Static files
app.use(express.static("public"));

// Socket setup
// Pass the server you want to work with
var io = socket(server);
// Listen to connection event
io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Listen to the chat message
    socket.on("chat", (data) => {
        // All the different sockets connected
        io.sockets.emit("chat", data);
    });

    // See who is typing
    socket.on("typing", (data) => {
        // Emits to every client excepted the one who is typing
        socket.broadcast.emit("typing", data);
    });
});
