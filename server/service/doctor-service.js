const Doctor = require('../models/doctor-model');

class DoctorService {
    async getDoctors() {
        return await Doctor.findAll();
    }
}

module.exports = new DoctorService();