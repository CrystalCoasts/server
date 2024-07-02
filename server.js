const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('turnOnLed', () => {
        console.log('Turn on LED command received');
        // Emit to specific ESP32 client if needed
        socket.emit('controlLed', { control: 'on' });
    });

    socket.on('turnOffLed', () => {
        console.log('Turn off LED command received');
        // Emit to specific ESP32 client if needed
        socket.emit('controlLed', { control: 'off' });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
