const express = require('express');
const router = express.Router();
const Veterinarian = require('../models/veterinarian.model');

// Tüm veterinerleri döner
router.get('/', async (req, res) => {
  try {
    const vets = await Veterinarian.findAll();
    res.json(vets);
  } catch (err) {
    res.status(500).json({ message: 'Veterinerler alınamadı.' });
  }
});

module.exports = router;