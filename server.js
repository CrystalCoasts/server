const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected due to ${reason}`);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('ping', () => {
    socket.emit('pong');
  });
  
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
