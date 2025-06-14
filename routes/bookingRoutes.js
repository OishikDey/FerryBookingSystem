const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');

router.get('/', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

router.post('/', async (req, res) => {
  const { date, time } = req.body;

  try {
    const slot = await Availability.findOne({ date, time });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found." });
    }

    if (slot.capacity <= 0) {
      return res.status(400).json({ error: "This slot is fully booked." });
    }

    const newBooking = new Booking(req.body);
    await newBooking.save();

    slot.capacity -= 1;
    await slot.save();

    res.json({ message: "Booking created and capacity updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.put('/:id', async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Booking updated' });
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({error: 'Booking not found.'})
    }
    const slot = await Availability.findOne({date: booking.date, time: booking.time});
    if (slot) {
      slot.capacity += 1;
      await slot.save();
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted and capacity updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error.'});
  }
});

module.exports = router;
