// services/UserService.ts

import $api from '../http';
import { AxiosResponse } from 'axios';

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

export default class UserService {
    static async getUserDetails(userId: number): Promise<User> {
        try {
            const response: AxiosResponse<User> = await $api.get<User>(`/users/${userId}`);
            console.log('Получен успешный ответ от сервера:', response.data);
            return response.data;  // Return the data directly
        } catch (error) {
            console.error('Ошибка в getUserDetails на клиенте:', error);
            throw new Error('Не удалось загрузить данные пользователя.');
        }
    }

    static async updateUserDetails(userId: number, userData: Partial<User>): Promise<User> {
        try {
            // Логируем входные параметры функции
            console.log('updateUserDetails вызвана с:', { userId, userData });
    
            // Отправка запроса на сервер
            console.log('Отправка PUT запроса на:', `/users/${userId}`);
            const response: AxiosResponse<User> = await $api.put<User>(`/users/${userId}`, userData);
    
            // Логируем успешный ответ
            console.log('Получен успешный ответ от сервера:', response.data);
    
            // Возвращаем данные
            return response.data;
        } catch (error) {
            // Логируем ошибку
            console.error('Ошибка в updateUserDetails на клиенте:', error);
            
            // Генерируем пользовательское сообщение об ошибке
            throw new Error('Не удалось обновить данные пользователя.');
        }
    }
    
}
