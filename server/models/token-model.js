const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user-model');

const sequelize = require('../bd/bd');

// Определяем модель пользователя
const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'authorization',
          key: 'id'
        }
      },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'token',
    timestamps: false
});

module.exports = Token;
