const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

router.get('/', async (req, res) => {
  const slots = await Availability.find();
  res.json(slots);
});

router.post('/', async (req, res) => {
  const newSlot = new Availability(req.body);
  await newSlot.save();
  res.json({ message: 'Slot added' });
});

router.delete('/:id', async (req, res) => {
  await Availability.findByIdAndDelete(req.params.id);
  res.json({ message: 'Slot removed' });
});

module.exports = router;
