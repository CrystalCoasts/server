require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const expressWs = require('express-ws');

const sensorDataRoutes = require('./routes/sensorData');
const wsRoutes = require('./routes/wsRoutes');

const app = express();
expressWs(app);  // This applies WebSocket functionality to Express app

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Routes
app.use('/api', sensorDataRoutes);
app.use('/ws', wsRoutes);  // WebSocket route for ESP32 interactions

// Base route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
