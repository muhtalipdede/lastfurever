const express = require('express');
const router = express.Router();
const Veterinarian = require('../models/veterinarian.model');

router.get('/', async (req, res) => {
  try {
    const vets = await Veterinarian.findAll({
      include: ['user']  // İlişkili user bilgilerini de getir
    });
    res.json(vets);
  } catch (err) {
    console.error('Veteriner listesi alınırken hata:', err);  // Hata logla
    res.status(500).json({ message: 'Veterinerler alınamadı.' });
  }
});


module.exports = router;