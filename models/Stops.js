const mongoose = require('mongoose');

// Define the Stops schema
const stopsSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  stops: [{
    stop_name: {
      type: String,
      required: true,
      trim: true
    },
    cost_from_origin: {
      type: Number,
      required: true,
      min: 0
    },
    cost_from_previous: {
      type: Number,
      required: true,
      min: 0
    },
    stop_time: {  // New field added here
      type: String,  // Use Date type to store date and time
      required: true
    }
  }],
  total_cost: {
    type: Number,
    required: true,
    min: 0
  },
  bus_no: { // New field added here
    type: String,
    required: true
  }
});

// Create the Stops model
const Stops = mongoose.model('Stops', stopsSchema);

module.exports = Stops;
