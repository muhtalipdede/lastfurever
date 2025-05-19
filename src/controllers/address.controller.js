const Address = require('../models/address.model');
const Notification = require('../models/notification.model');
const { Op } = require('sequelize');

const addressController = {
  // Tüm adresleri getir
  getAddresses: async (req, res) => {
    try {
      const addresses = await Address.findAll({
        where: {
          userId: req.user.id,
          isActive: true
        },
        order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Yeni adres ekle
  addAddress: async (req, res) => {
    try {
      const {
        addressLine,
        city,
        district,
        neighborhood,
        building,
        floor,
        apartment,
        addressNote,
        addressTitle,
        isDefault
      } = req.body;

      // Eğer yeni adres varsayılan olarak işaretlendiyse, diğer adreslerin varsayılan durumunu kaldır
      if (isDefault) {
        await Address.update(
          { isDefault: false },
          {
            where: {
              userId: req.user.id,
              isDefault: true
            }
          }
        );
      }

      const address = await Address.create({
        userId: req.user.id,
        addressLine,
        city,
        district,
        neighborhood,
        building,
        floor,
        apartment,
        addressNote,
        addressTitle,
        isDefault
      });

      const notification = {
        user_id: req.user.id,
        message: `Yeni adres eklendi: ${addressTitle || 'Yeni Adres'}`,
        type: 'Info',
        isRead: false
      };

      await Notification.create(notification);

      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Adres güncelle
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        addressLine,
        city,
        district,
        neighborhood,
        building,
        floor,
        apartment,
        addressNote,
        addressTitle,
        isDefault
      } = req.body;

      // Eğer adres varsayılan olarak işaretlendiyse, diğer adreslerin varsayılan durumunu kaldır
      if (isDefault) {
        await Address.update(
          { isDefault: false },
          {
            where: {
              userId: req.user.id,
              isDefault: true,
              id: { [Op.ne]: id }
            }
          }
        );
      }

      const [updated] = await Address.update(
        {
          addressLine,
          city,
          district,
          neighborhood,
          building,
          floor,
          apartment,
          addressNote,
          addressTitle,
          isDefault
        },
        {
          where: {
            id,
            userId: req.user.id
          }
        }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Adres bulunamadı' });
      }

      const updatedAddress = await Address.findByPk(id);
      res.json(updatedAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Adres sil (soft delete)
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Address.update(
        { isActive: false },
        {
          where: {
            id,
            userId: req.user.id
          }
        }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Adres bulunamadı' });
      }

      res.json({ message: 'Adres başarıyla silindi' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Varsayılan adresi değiştir
  setDefaultAddress: async (req, res) => {
    try {
      const { id } = req.params;

      // Önce tüm adreslerin varsayılan durumunu kaldır
      await Address.update(
        { isDefault: false },
        {
          where: {
            userId: req.user.id
          }
        }
      );

      // Seçilen adresi varsayılan yap
      const [updated] = await Address.update(
        { isDefault: true },
        {
          where: {
            id,
            userId: req.user.id
          }
        }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Adres bulunamadı' });
      }

      res.json({ message: 'Varsayılan adres başarıyla güncellendi' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = addressController;