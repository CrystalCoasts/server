require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve a simple test page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example endpoints to control the LED from external API calls
  app.get('/led/on', (req, res) => {
    socket.emit('controlLed', 'turnOnLed');
    res.send('LED On command sent');
  });

  app.get('/led/off', (req, res) => {
    socket.emit('controlLed', 'turnOffLed');
    res.send('LED Off command sent');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
