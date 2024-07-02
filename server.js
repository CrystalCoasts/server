const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws) {
    clients.push(ws);
    console.log('A client connected');

    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);
        // Broadcast message to all clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('A client disconnected');
    });

    // Send a greeting message when a client connects
    ws.send('Hello from server');
});

// Ensure the index.html is served at the base route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
