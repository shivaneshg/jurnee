const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Book a guide
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

module.exports = router;
