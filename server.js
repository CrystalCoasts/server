const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle CORS if necessary
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve your front-end or send a basic response
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

// Endpoint to receive data from ESP32
app.post('/sendData', function (req, res) {
    // Example: emit to all connected sockets
    io.sockets.emit('event', { message: "Hello from server!" });
    res.send({});
});

// Socket.IO connection handling
io.on('connection', function (socket) {
    console.log('User Connected!');

    // Example: send a message to the connected client
    socket.emit('event', { message: 'Connected !!!!' });

    // Example: handle incoming 'status' events from client
    socket.on('status', function (data) {
        console.log(data);
    });
});

// Start the server listening on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}`);
});
