const WebSocket = require('ws'); // This is necessary if you need WebSocket constants

function setupWebSocket(wss) {
    let clients = [];

    wss.on('connection', function connection(ws, req) {
        const location = new URL(req.url, `http://${req.headers.host}`);
        ws.clientType = location.searchParams.get('clientType') || 'unknown';

        clients.push(ws);
        console.log(`A client connected: ${ws.clientType}`);
        updateClientCounts(clients);

        ws.on('message', function incoming(message) {
            console.log(`Received from ${ws.clientType}: ${message}`);
            handleMessage(ws, message, clients);
        });

        ws.on('close', () => {
            clients = clients.filter(client => client !== ws);
            console.log(`A client disconnected: ${ws.clientType}`);
            updateClientCounts(clients);
        });

        ws.on('error', error => {
            console.error(`WebSocket error from ${ws.clientType}:`, error);
        });

        ws.send(`Hello from server to ${ws.clientType}`);
    });
}

function updateClientCounts(clients) {
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

function handleMessage(ws, message, clients) {
    // Check client type and connection status
    if (ws.clientType === 'webapp') {
        const esp32Connected = clients.some(client => client.clientType === 'esp32' && client.readyState === WebSocket.OPEN);
        if (!esp32Connected) {
            console.log('No ESP32 clients connected.');
            ws.send('ESP32 not connected.');
            return;
        }
    }

    // Broadcast message to other clients
    clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

module.exports = setupWebSocket;
