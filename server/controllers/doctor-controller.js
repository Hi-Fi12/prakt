// controllers/doctor-controller.js

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
}

module.exports = new DoctorController();
