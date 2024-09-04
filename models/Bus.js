const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  bus_no: { type: String, required: true },
  bus_name: { type: String, required: true },
  rg_no: { type: String, required: true },
  driver_name: { type: String, required: true },
  cond_name: { type: String, required: true },
  capacity: { type: Number, required: true }
});

module.exports = mongoose.model('Bus', busSchema);
