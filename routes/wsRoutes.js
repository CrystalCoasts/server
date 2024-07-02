const express = require('express');
const router = express.Router();
const expressWs = require('express-ws')(router);

const { turnOnLed, turnOffLed, fetchSensorData } = require('../handlers/esp32Handlers');

router.ws('/', (ws, req) => {
  ws.on('message', function(msg) {
    console.log('Received message:', msg);
    const message = JSON.parse(msg);

    switch (message.type) {
      case 'turnOnLed':
        turnOnLed(ws);
        break;
      case 'turnOffLed':
        turnOffLed(ws);
        break;
      case 'fetchSensorData':
        fetchSensorData(ws);
        break;
      default:
        ws.send(JSON.stringify({ error: 'Unknown command' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

module.exports = router;
