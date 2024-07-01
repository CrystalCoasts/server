require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const sensorDataRoutes = require('./routes/sensorData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the sensor data routes
app.use('/api', sensorDataRoutes);

// Proxy routes for ESP32
const esp32BaseUrl = 'http://esp32.local'; // mDNS name

app.get('/esp32/led/on', async (req, res) => {
  try {
    const response = await axios.get(`${esp32BaseUrl}/led/on`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error communicating with ESP32');
  }
});

app.get('/esp32/led/off', async (req, res) => {
  try {
    const response = await axios.get(`${esp32BaseUrl}/led/off`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error communicating with ESP32');
  }
});

app.get('/esp32/fetch', async (req, res) => {
  try {
    const response = await axios.get(`${esp32BaseUrl}/fetch`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error communicating with ESP32');
  }
});

// Base route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
