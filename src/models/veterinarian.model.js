const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Veterinarian = sequelize.define('veterinarians', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clinic_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tax_document: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
});

module.exports = Veterinarian; 