var express = require('express');
var socket = require('socket.io');
var cors = require('cors');
var bodyParser = require('body-parser');


// App setup
var app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({ extended: false})
 )
var server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

// Static files
// app.use(express.static("public"));

// Socket setup
// Pass the server you want to work with
var io = socket(server);
// Listen to connection event
io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Listen to the chat message
    socket.on("chat-message", (message) => {
        // All the different sockets connected
        console.log(message);
        io.sockets.emit("chat-message", message);
    });

    // See who is typing
    socket.on("typing", (data) => {
        // Emits to every client excepted the one who is typing
        socket.broadcast.emit("typing", data);
    });
});

var Users = require ('../routes/Users')

app.use('../users', Users)