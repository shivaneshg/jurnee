const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/guides', guideRoutes);
app.use('/api/bookings', bookingRoutes);
app.get('/', (req, res) => {
  res.send('Jurnee backend is live ✅');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.error('MongoDB error:', err));
