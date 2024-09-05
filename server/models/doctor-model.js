// models/doctor-model.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../bd/bd');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'doctors',
    timestamps: false
});

module.exports = Doctor;
