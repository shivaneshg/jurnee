const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  email: String,
  location: String,
  experienceYears: Number,
  hourlyRate: Number,
  languages: String,
  specialties: String,
  description: String,
  profileImage: String,
  isAvailable: Boolean,
  rating: Number,
  reviewCount: Number,
  createdAt: Date
});

module.exports = mongoose.model('Guide', guideSchema);
