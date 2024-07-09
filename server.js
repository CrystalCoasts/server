const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const setupWebSocket = require('./routes/wsRoutes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from 'public' directory
app.use(express.static('public'));

// Initialize WebSocket routing
setupWebSocket(wss);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
