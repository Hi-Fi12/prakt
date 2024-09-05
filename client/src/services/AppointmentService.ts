import $api from "../http";
import { AxiosResponse, AxiosError } from 'axios';
import { IAppointment } from '../models/IAppointment';
import UserService from '../../../server/service/user-service.js';

function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}

export default class AppointmentService {
    static async getAppointments(): Promise<AxiosResponse<IAppointment[]>> {
        try {
            return await $api.get<IAppointment[]>('/appointments');
        } catch (error: unknown) {
            console.error('Ошибка при запросе записей:', error);
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
            }
            throw error; // Проброс ошибки выше
        }
    }

    static async getAppointmentsById(id: number): Promise<AxiosResponse<IAppointment[]>> {
        try {
            return await $api.get<IAppointment[]>(`/appointments/${id}`);
        } catch (error: unknown) {
            console.error('Ошибка при запросе записей:', error);
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
            }
            throw error; // Проброс ошибки выше
        }
    }

    static async createAppointment(
        doctorId: number, 
        date: string,
        time: string,
        patient_id: number
    ): Promise<AxiosResponse<IAppointment>> {
        try {
            console.log('Создание записи:');
            console.log('doctorId:', doctorId);
            console.log('date:', date);
            console.log('time:', time);
            console.log('patient_id:', patient_id);
            
            const response = await $api.post<IAppointment>('/appointments', {
                doctorId,
                date,
                time,
                patient_id
            });
            
            console.log('Запись успешно создана:');
            console.log('Response:', response.data);
            
            return response;
        } catch (error: unknown) {
            console.error('Ошибка при создании записи:');
            console.error('Request data:', { doctorId, date, time, patient_id });
            
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
                console.error('Ответ от сервера:', error.response?.data);
            } else {
                console.error('Неизвестная ошибка:', error);
            }
            
            throw error;
        }
    }
    static async getAppointmentsByDoctorAndDate(doctorId: number, date: string): Promise<AxiosResponse<IAppointment[]>> {        
        try {
            console.log(`Отправка запроса на получение записей для доктора с ID: ${doctorId} на дату: ${date}`);
            
            const response = await $api.get<IAppointment[]>('/appointments/by-doctor-and-date', {
                params: {
                    doctorId,
                    date,
                },
            });
            
            console.log('Успешно получены данные о записях:', response.data);
            return response;
        } catch (error: unknown) {
            console.error('Ошибка при получении записей по дате и врачу:', error);
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
            }
            throw new Error(`Ошибка при получении записей для доктора с ID: ${doctorId} на дату: ${date}`);
        }
    }

    static async deleteAppointment(id: number): Promise<void> {
        try {
            await $api.delete(`/appointments/${id}`);
            console.log(`Запись с ID: ${id} успешно удалена`);
        } catch (error: unknown) {
            console.error('Ошибка при удалении записи:', error);
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
                console.error('Ответ от сервера:', error.response?.data);
            } else {
                console.error('Неизвестная ошибка:', error);
            }
            throw error;
        }
    }
    
}
