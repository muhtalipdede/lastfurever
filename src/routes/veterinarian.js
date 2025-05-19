const express = require('express');
const router = express.Router();
const Veterinarian = require('../models/veterinarian.model');
const User = require('../models/user.model');

router.get('/', async (req, res) => {
  try {
    let vets = await Veterinarian.findAll({});

    const vetUserIds = vets.map(vet => vet.user_id); 

    const uniqueVetUserIds = [...new Set(vetUserIds)];  // Kullanıcı ID'lerini benzersiz hale getir

    const users = await User.findAll({
      where: {
        id: uniqueVetUserIds
      }
    });

    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user;
    });
    const result = vets.map(vet => {
      const user = userMap[vet.user_id];
      return {
        id: vet.id,
        clinic_name: vet.clinic_name,
        district: vet.district,
        neighborhood: vet.neighborhood,
        tax_document: vet.tax_document,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    });
    res.status(200).json(result);  // Veterinerleri döndür
  } catch (err) {
    console.error('Veteriner listesi alınırken hata:', err);  // Hata logla
    res.status(500).json({ message: 'Veterinerler alınamadı.' });
  }
});


module.exports = router;