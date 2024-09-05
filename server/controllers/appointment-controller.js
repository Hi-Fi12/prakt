const Appointment = require('../models/appointment-model');
const ApiError = require('../exceptions/api-error');
const AppointmentService = require('../service/appointment-service'); // Убедитесь, что путь правильный


class AppointmentController {
    // Метод для создания новой записи
    async create(req, res) {
        try {
            // Логирование полученных данных из запроса
            const { doctorId, date, time, patient_id } = req.body;
            //console.log('Полученные данные для создания записи:');
            //console.log('doctorId:', doctorId);
            //console.log('date:', date);
            //console.log('time:', time);
            //console.log('patient_id:', patient_id);
    
            // Проверка на наличие всех необходимых данных
            if (!doctorId || !date || !time || !patient_id) {
                console.warn('Не все данные переданы');
                return res.status(400).json({ message: 'Не все данные переданы' });
            }
    
            // Проверка на наличие записи на это время у этого врача
            //console.log('Проверка наличия записи у врача на указанное время...');
            const existingAppointment = await AppointmentService.getAppointmentsByDoctorAndDateAndTime(doctorId, date, time);
            //console.log('Результат проверки записи:', existingAppointment);
    
            if (existingAppointment.length > 0) {
                console.warn('Время уже занято');
                return res.status(409).json({ message: 'Время уже занято' });
            }
    
            // Создание новой записи
            //console.log('Создание новой записи...');
            const appointment = await AppointmentService.createAppointment(doctorId, date, time, patient_id);
            //console.log('Запись успешно создана:', appointment);
    
            return res.status(201).json(appointment);
        } catch (error) {
            // Логирование ошибки
            console.error('Ошибка при создании записи:', error);
            return res.status(500).json({ message: 'Ошибка при создании записи' });
        }
    }
    

    // Метод для получения всех записей
    async getAll(req, res, next) {
        try {
            const appointments = await AppointmentService.getAppointments();
            res.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    }

    // Метод для получения записи по ID
    async getById(req, res, next) {
    try {
        const { id } = req.params;

        //console.log(`Получен запрос на получение записи с ID: ${id}`);

        const appointment = await AppointmentService.getAppointmentById(id);

        if (!appointment) {
            console.warn(`Запись с ID: ${id} не найдена`);
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        //console.log(`Запись с ID: ${id} успешно получена:`, appointment);
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Ошибка при получении записи:', error);
        next(error); // Передаем ошибку в следующий обработчик
    }
}

async getAllById(req, res, next) {
    try {
        const { id } = req.params;

        //console.log(`Получен запрос на получение записи с ID: ${id}`);

        const appointment = await AppointmentService.getAllAppointments(id);

        if (!appointment) {
            console.warn(`Запись с ID: ${id} не найдена`);
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        //console.log(`Запись с ID: ${id} успешно получена:`, appointment);
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Ошибка при получении записи:', error);
        next(error); // Передаем ошибку в следующий обработчик
    }
}


    // Метод для обновления записи
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const appointment = await AppointmentService.updateAppointment(id, updates);
            res.status(200).json(appointment);
        } catch (error) {
            next(error);
        }
    }

    // Метод для удаления записи
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await AppointmentService.deleteAppointment(id);
            res.status(200).json({ message: 'Запись удалена' });
        } catch (error) {
            next(error);
        }
    }

    async getAppointmentsByDoctorAndDate(req, res) {
        try {
            const { doctorId, date } = req.query;
    
            //console.log(`Получен запрос на получение записей для доктора с ID: ${doctorId} на дату: ${date}`);
    
            if (!doctorId || !date) {
                console.warn('Не все данные переданы. doctorId:', doctorId, 'date:', date);
                return res.status(400).json({ message: 'Не все данные переданы' });
            }
    
            // Вызов метода сервиса для получения записей
            const appointments = await AppointmentService.getAppointmentsByDoctorAndDate(Number(doctorId), date);
            
            //console.log('Записи успешно получены:', appointments);
    
            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Ошибка при получении записей:', error);
            return res.status(500).json({ message: 'Ошибка на сервере' });
        }
    }
    
}

module.exports = new AppointmentController();
