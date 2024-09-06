// controllers/doctor-controller.js

const doctorService = require('../service/doctor-service');
const DoctorService = require('../service/doctor-service');

class DoctorController {
    async getDoctors(req, res, next) {
        try {
            const doctors = await DoctorService.getDoctors();
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Ошибка при получении списка врачей:', error);
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await doctorService.deleteDoctor(id);
            res.status(200).json({ message: 'Запись удалена' });
        } catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const doctor = await doctorService.createDoctor(req.body);
            res.status(201).json(doctor);
        } catch (error) {
            next(error);
        }
    }

    async getDoctorById(req, res, next) {
        try {
            const { id } = req.params;
            console.log(`Получен запрос на получение врача с ID:`, id);
            const doctor = await doctorService.getDoctorById(id);
            res.status(200).json(doctor);
        } catch (error) {
            next(error);
        }
    }
}




module.exports = new DoctorController();
