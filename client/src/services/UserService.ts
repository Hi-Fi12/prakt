// services/UserService.ts

import { waitFor } from '@testing-library/react';
import $api from '../http';
import { AxiosResponse, AxiosError } from 'axios';
import { warn } from 'console';

export interface User {
    id: number;
    email: string;
    password: string;  // Consider security and privacy; this may not be needed for frontend
    isActivated: boolean;
    activationLink?: string;
    isAdmin: boolean;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string
    gender?: 'Male' | 'Female' | 'Other';
    phone_number?: string;
    address?: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialization: string;
}
function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}
export default class UserService {

    
    
    static async deleteDoctor(id: number): Promise<void> {
        try {
            await $api.delete(`/doctor/${id}`);
            //console.log(`Запись с ID: ${id} успешно удалена`);
        } catch (error: unknown) {
            console.error('Ошибка при удалении doctor:', error);
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
    static async updateUserDetails(userId: number, userData: Partial<User>): Promise<User> {
        try {
            // Логируем входные параметры функции
            ////console.log('updateUserDetails вызвана с:', { userId, userData });
    
            // Отправка запроса на сервер
            ////console.log('Отправка PUT запроса на:', `/users/${userId}`);
            const response: AxiosResponse<User> = await $api.put<User>(`/users/${userId}`, userData);
    
            // Логируем успешный ответ
            ////console.log('Получен успешный ответ от сервера:', response.data);
    
            // Возвращаем данные
            return response.data;
        } catch (error) {
            // Логируем ошибку
            console.error('Ошибка в updateUserDetails на клиенте:', error);
            
            // Генерируем пользовательское сообщение об ошибке
            throw new Error('Не удалось обновить данные пользователя.');
        }
    }
    
    static async createDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
        try {
            // Логируем входные параметры функции
            ////console.log('updateUserDetails вызвана с:', { userId, userData });
    
            // Отправка запроса на сервер
            ////console.log('Отправка PUT запроса на:', `/users/${userId}`);
            const response: AxiosResponse<Doctor> = await $api.put<Doctor>(`/newdoctor`, doctorData);
    
            // Логируем успешный ответ
            ////console.log('Получен успешный ответ от сервера:', response.data);
    
            // Возвращаем данные
            return response.data;
        } catch (error) {
            // Логируем ошибку
            console.error('Ошибка в updateUserDetails на клиенте:', error);
            
            // Генерируем пользовательское сообщение об ошибке
            throw new Error('Не удалось обновить данные пользователя.');
        }
    }

    static async getUserDetails(userId: number): Promise<User> {
        try {
            const response: AxiosResponse<User> = await $api.get<User>(`/users/${userId}`);
            ////console.log('Получен успешный ответ от сервера:', response.data);
            return response.data;  // Return the data directly
        } catch (error) {
            console.error('Ошибка в getUserDetails на клиенте:', error);
            throw new Error('Не удалось загрузить данные пользователя.');
        }
    }
    static async getAllUsers()  {
        try {
            //console.log('getAllUsers вызвана');
            const response: AxiosResponse<User[]> = await $api.get<User[]>(`/all_users`);
            //console.log('Получен getAllUsers успешный ответ сервера:', response);
            return response.data;  // Return the data directly
            
            
        } catch (error) {
            console.error('Ошибка в getUserDetails на клиенте:', error);
            throw new Error('Не удалось загрузить данные пользователя.');
        }
    }
    static async getAllDoctors()  {
        try {
            //console.log('getAllUsers вызвана');
            const response: AxiosResponse<Doctor[]> = await $api.get<Doctor[]>(`/doctors`);
            //console.log('Получен getAllUsers успешный ответ сервера:', response);
            return response.data;  // Return the data directly
            
            
        } catch (error) {
            console.error('Ошибка в getAllDoctors на клиенте:', error);
            throw new Error('Не удалось загрузить данные Докторов.');
        }
    }
}
