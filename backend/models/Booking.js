const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guideId: String,
  userId: String,
  userName: String,
  userPhone: String,
  userAddress: String,
  requestDate: Date,
  status: String // pending, confirmed, rejected
});

module.exports = mongoose.model('Booking', bookingSchema);
