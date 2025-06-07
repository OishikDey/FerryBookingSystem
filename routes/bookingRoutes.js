const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.get('/', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

router.post('/', async (req, res) => {
  const newBooking = new Booking(req.body);
  await newBooking.save();
  res.json({ message: 'Booking created' });
});

router.put('/:id', async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Booking updated' });
});

router.delete('/:id', async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Booking deleted' });
});

module.exports = router;
