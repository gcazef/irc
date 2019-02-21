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

//app.post('/register', Users);
//app.post('/login', Users);
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