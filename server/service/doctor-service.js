const Doctor = require('../models/doctor-model');

class DoctorService {
    async getDoctors() {
        return await Doctor.findAll();
    }

async deleteDoctor(id) {
    try {
        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            throw ApiError.NotFound('Запись не найдена');
        }
        await doctor.destroy();
        return { message: 'Запись удалена' };
    } catch (error) {
        throw ApiError.BadRequest('Ошибка при удалении записи');
    }
}

async createDoctor(doctorData) {
    try {
        const doctor = await Doctor.create(doctorData);
        return doctor;
    } catch (error) {
        throw ApiError.BadRequest('Ошибка при создании записи');
    }
}

async getDoctorById(id) {
    const doctor = await Doctor.findByPk(id);
    return doctor;
}
}
module.exports = new DoctorService();
