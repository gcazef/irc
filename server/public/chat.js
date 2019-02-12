// Make socket connection
var socket = io.connect("http://localhost:5000");

// Query DOM elements
var nm = document.getElementById("nick");
var msg = document.getElementById("message");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

// Emit events
btn.addEventListener("click", () => {
    // Send data to the server: event name, data
    socket.emit("chat", {
        message: msg.value,
        name: nm.value
    });
});

// Detect when user is typing
msg.addEventListener("keypress", () => {
    socket.emit("typing", nm.value);
});

// Listen for events
socket.on("chat", (data) => {
    feedback.innerHTML = "";
    output.innerHTML += "<p><strong>" + data.name + ": </strong>" + data.message + "</p>";
});

socket.on("typing", (data) => {
    feedback.innerHTML = "<p><em>" + data + " is typing..." + "</em></p>";
});
