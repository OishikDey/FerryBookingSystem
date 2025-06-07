const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  emailAddress: String,
  departureDate: String,
  time: String,
  selectedPackage: String
});

module.exports = mongoose.model('Booking', bookingSchema);
