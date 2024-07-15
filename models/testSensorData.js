const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSensorDataSchema = new Schema({
  // timestamp: {
  //   type: Date,
  //   default: Date.now,
  // },
  pH: Number,
  oxygenLevel: Number,
  turbidity: Number,
  temperature: Number,
  salinity: Number,
  tds: Number,

  Month: String,
  Day: Number,
  Year: Number,
  Hour: Number,
  Minute: Number,
  Second: Number,
});

module.exports = mongoose.model('TestSensorData', testSensorDataSchema);
