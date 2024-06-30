require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const sensorDataRoutes = require('./routes/sensorData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

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

// Define routes for ESP32 control
app.get('/esp32/led/on', (req, res) => {
  res.send('LED turned on'); // Replace with actual control code
});
app.get('/esp32/led/off', (req, res) => {
  res.send('LED turned off'); // Replace with actual control code
});
app.get('/esp32/sensor/data', (req, res) => {
  res.json({ temperature: 22 }); // Mock sensor data; replace with actual sensor data retrieval
});

// Base route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
