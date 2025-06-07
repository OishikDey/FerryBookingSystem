const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: String,
  time: String
});

module.exports = mongoose.model('Availability', availabilitySchema);
