const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');

// Register guide
router.post('/register', async (req, res) => {
  try {
    const guide = new Guide(req.body);
    await guide.save();
    res.status(201).json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get all guides
router.get('/', async (req, res) => {
  const guides = await Guide.find();
  res.json(guides);
});

router.post('/login', async (req, res) => {
  const { email, phone } = req.body;
  const guide = await Guide.findOne({ email, phone });

  if (!guide) {
    return res.status(401).json({ error: 'Invalid email or phone' });
  }

  res.json(guide);
});

// Get users interested in a guide
router.get('/:guideId/interested-users', async (req, res) => {
  const bookings = await Booking.find({ guideId: req.params.guideId, status: 'pending' });
  res.json(bookings);
});

// Confirm a user
router.post('/:guideId/confirm-user', async (req, res) => {
  const { userId } = req.body;
  await Booking.findOneAndUpdate(
    { guideId: req.params.guideId, userId },
    { status: 'confirmed' }
  );
  res.json({ message: 'User confirmed' });
});

// Reject a user
router.delete('/:guideId/reject-user/:userId', async (req, res) => {
  await Booking.findOneAndDelete({
    guideId: req.params.guideId,
    userId: req.params.userId
  });
  res.json({ message: 'User rejected' });
});

module.exports = router;
