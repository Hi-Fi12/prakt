const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../bd/bd'); // Убедитесь, что путь к вашему экземпляру Sequelize верный

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY, // Используйте DATEONLY для даты без времени
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled' // Значение по умолчанию
    },
    createdAt: {
        type: DataTypes.DATE, // Поле для хранения времени создания
        defaultValue: Sequelize.NOW, // Значение по умолчанию - текущее время
        field: 'created_at' // Имя поля в таблице
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Поле может быть NULL, так как это не обязательное поле
        field: 'patient_id' // Имя поля в таблице
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'doctorId' // Имя поля в таблице
    }
}, {
    tableName: 'appointments',
    timestamps: false, // Мы не используем timestamps (createdAt, updatedAt)
    underscored: true // Используйте `snake_case` для полей в модели
});


module.exports = Appointment;
