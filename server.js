const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static('public'));

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    ws.clientType = location.query.clientType || 'unknown';  // Store client type in the WebSocket object

    clients.push(ws);
    console.log(`A client connected: ${ws.clientType}`);
    
    updateClientCounts();  // Update and log client counts

    ws.on('message', function incoming(message) {
        console.log(`Received from ${ws.clientType}: ${message}`);
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log(`A client disconnected: ${ws.clientType}`);
        updateClientCounts();  // Update counts on disconnect as well
    });

    ws.on('error', error => {
        console.error(`WebSocket error from ${ws.clientType}:`, error);
    });

    ws.send(`Hello from server to ${ws.clientType}`);
});

function updateClientCounts() {
    let webClients = 0;
    let esp32Clients = 0;
    clients.forEach(client => {
        if (client.clientType === 'webapp') {
            webClients++;
        } else if (client.clientType === 'esp32') {
            esp32Clients++;
        }
    });
    console.log(`Total clients connected: ${clients.length}`);
    console.log(`Total webapp clients connected: ${webClients}`);
    console.log(`Total esp32 clients connected: ${esp32Clients}`);
}

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
