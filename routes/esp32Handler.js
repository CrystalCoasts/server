// ESP-specific functionalities

const turnOnLed = (ws) => {
    console.log('Turning on LED');
    ws.send(JSON.stringify({ status: 'LED turned on' }));
  };
  
  const turnOffLed = (ws) => {
    console.log('Turning off LED');
    ws.send(JSON.stringify({ status: 'LED turned off' }));
  };
  
  const fetchSensorData = (ws) => {
    console.log('Fetching sensor data');
    // Example: Fetching data from a hypothetical sensor
    const sensorData = {
      temperature: 22,
      humidity: 45
    };
    ws.send(JSON.stringify({ sensorData }));
  };
  
  module.exports = {
    turnOnLed,
    turnOffLed,
    fetchSensorData
  };
  