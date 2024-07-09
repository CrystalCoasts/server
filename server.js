const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const url = require('url');  // Make sure to include this for URL parsing

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let webClients = 0;
let esp32Clients = 0;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws, req) {
  try {
      const location = url.parse(req.url, true);
      const clientType = location.query.clientType || 'unknown';

      clients.push(ws);
      console.log(`A client connected: ${clientType}`);
      console.log(`Total clients connected: ${clients.length}`); // Log the total number of clients connected
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].clientType === 'webapp') {
          webClients++;
        } else if (clients[i].clientType === 'esp32') { 
          esp32Clients++;
        }
      }

        console.log(`Total webapp clients connected: ${webClients}`);
        console.log(`Total esp32 clients connected: ${esp32Clients}`);

      ws.on('message', function incoming(message) {
          console.log(`Received from ${clientType}: ${message}`);
          // Broadcast message to all clients
          clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                  // client.send(`From ${clientType}: ${message}`);
                  client.send(`${message}`);
              }
          });
      });

      ws.on('close', () => {
          clients = clients.filter(client => client !== ws);
          console.log(`A client disconnected: ${clientType}`);
      });

      ws.on('error', error => {
          console.error(`WebSocket error from ${clientType}:`, error);
      });

      ws.send(`Hello from server to ${clientType}`);
  } catch (error) {
      console.error('Failed to handle a connection:', error);
      ws.close(); // Close the connection if an error occurs during setup
  }
});

// Ensure the index.html is served at the base route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
