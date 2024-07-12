// routes/sensorData.js
const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');

// Route to get all sensor data
router.get('/data', async (req, res) => {
  try {
    const data = await SensorData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add new sensor data
router.post('/data', async (req, res) => {
  const sensorData = new SensorData({
    pH: req.body.pH,
    oxygenLevel: req.body.oxygenLevel,
    turbidity: req.body.turbidity,
    tds: req.body.tds,
    temperature: req.body.temperature,
    salinity: req.body.salinity,
  });

  try {
    const newSensorData = await sensorData.save();
    res.status(201).json(newSensorData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to add new test sensor data
router.post('/test-data', async (req, res) => {
  const testSensorData = new TestSensorData({
    pH: req.body.pH,
    oxygenLevel: req.body.oxygenLevel,
    turbidity: req.body.turbidity,
    tds: req.body.tds,
    temperature: req.body.temperature,
    salinity: req.body.salinity,
  });

  try {
    const newTestSensorData = await testSensorData.save();
    res.status(201).json(newTestSensorData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
