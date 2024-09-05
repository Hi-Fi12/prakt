const AppointmentModel = require('../models/appointment-model'); // Импорт вашей модели записи
const ApiError = require('../exceptions/api-error');
const Appointment = require('../models/appointment-model'); // Путь к модели может быть другим
const moment = require('moment'); // Убедитесь, что moment установлен


class AppointmentService {
    // Метод для создания новой записи
    
    async createAppointment( doctorId, date, time, patient_id, status = 'Scheduled') {
        //console.log('Создание новой запи123си...');
        try {
            // Логирование входных параметров
            //console.log('Попытка создать запись с данными:');
            //console.log('patient_id:', patient_id);
            //console.log('doctorId:', doctorId);
            //console.log('date:', date);
            //console.log('time:', time);
            //console.log('status:', status);
    
            // Проверка наличия всех необходимых данных
            if (!patient_id || !doctorId || !date || !time) {
                console.warn('Некоторые поля не заполнены');
                throw ApiError.BadRequest('Все поля должны быть заполнены');
            }
    
            // Создание новой записи
            //console.log('Со312здание новой записи...');
            const appointment = await Appointment.create({
                patient_id,
                doctorId,
                date, // Убедитесь, что дата в правильном формате
                time, // Убедитесь, что время в правильном формате
                status: 'Scheduled'
            });
    
            // Логирование успешного результата
            //console.log('Запись успешно создана:');
            //console.log('Appointment:', appointment);
    
            return appointment;
        } catch (error) {
            // Логирование ошибки
            console.error('Ошибка при создании записи:', error);
            throw ApiError.BadRequest('Ошибка при создании записи');
        }
    }

    // Метод для получения всех записей
    async getAppointments() {
        try {
            const appointments = await AppointmentModel.findAll();
            return appointments;
        } catch (error) {
            throw ApiError.BadRequest('Ошибка при получении записей');
        }
    }

    // Метод для получения записи по ID
    async getAllAppointments() {
        try {
            //console.log('Запрос на получение всех записей');
    
            const appointments = await AppointmentModel.findAll();
    
            if (appointments.length === 0) {
                //console.log('Записи не найдены');
                return { message: 'Записи не найдены', data: [null] }; // Возвращаем сообщение о том, что записей нет
            }
    
            //console.log('Все записи успешно получены:', appointments);
            return { message: 'Записи успешно получены', data: appointments }; // Возвращаем успешный результат
        } catch (error) {
            console.error('Неизвестная ошибка при получении записей:', error);
            throw ApiError.BadRequest('Ошибка при получении записей');
        }
    }
    
    

    // Метод для обновления записи
    async updateAppointment(id, updates) {
        try {
            const appointment = await AppointmentModel.findByPk(id);
            if (!appointment) {
                throw ApiError.NotFound('Запись не найдена');
            }
            await appointment.update(updates);
            return appointment;
        } catch (error) {
            throw ApiError.BadRequest('Ошибка при обновлении записи');
        }
    }

    // Метод для удаления записи
    async deleteAppointment(id) {
        try {
            const appointment = await AppointmentModel.findByPk(id);
            if (!appointment) {
                throw ApiError.NotFound('Запись не найдена');
            }
            await appointment.destroy();
            return { message: 'Запись удалена' };
        } catch (error) {
            throw ApiError.BadRequest('Ошибка при удалении записи');
        }
    }

    async getAppointmentsByDoctorAndDate(doctorId, date) {
        //console.log('Получение записей по врачу и дате:');
        //console.log('doctorId:', doctorId);
        //console.log('date:', date);
        
        try {
            // Выполнение запроса
            const appointments = await AppointmentModel.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                }
            });
    
            //console.log('Записи успешно получены:');
            //console.log('Appointments:', appointments);
    
            return appointments;
        } catch (error) {
            console.error('Ошибка при получении записей:');
            console.error('doctorId:', doctorId);
            console.error('date:', date);
    
            if (error instanceof Error) {
                console.error('Сообщение ошибки:', error.message);
                console.error('Стек вызовов:', error.stack);
            } else {
                console.error('Неизвестная ошибка:', error);
            }
            
            throw error; // Перебрасываем ошибку дальше, чтобы обработать её на уровне вызывающего кода
        }
    }

    async getAppointmentsByDoctorAndDateAndTime(doctorId, date, time) {
        return Appointment.findAll({
            where: {
                doctorId: doctorId,
                date: date,
                time: time
            }
        });
    }
}

module.exports = new AppointmentService();
