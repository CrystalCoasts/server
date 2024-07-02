const express = require('express');
const router = express.Router();
const expressWs = require('express-ws')(router);

const { turnOnLed, turnOffLed, fetchSensorData } = require('../handlers/esp32Handlers');

router.ws('/', (ws, req) => {
  ws.on('message', function(msg) {
    console.log('Received message:', msg);
    let message;
    try {
      message = JSON.parse(msg);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    if (message.type) {
      switch (message.type) {
        case 'turnOnLed':
          turnOnLed(ws);
          console.log('Sending command to ESP32: turnOnLed');
          ws.send(JSON.stringify({ type: 'turnOnLed' }));
          break;
        case 'turnOffLed':
          turnOffLed(ws);
          console.log('Sending command to ESP32: turnOffLed');
          ws.send(JSON.stringify({ type: 'turnOffLed' }));
          break;
        case 'fetchSensorData':
          fetchSensorData(ws);
          console.log('Sending command to ESP32: fetchSensorData');
          ws.send(JSON.stringify({ type: 'fetchSensorData' }));
          break;
        default:
          console.log('Sending error to ESP32: Unknown command');
          ws.send(JSON.stringify({ error: 'Unknown command' }));
      }
    } else {
      console.log('Sending error to ESP32: Missing type');
      ws.send(JSON.stringify({ error: 'Unknown command' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

module.exports = router;
