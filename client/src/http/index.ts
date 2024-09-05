import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

// Добавление токена в заголовок запроса
$api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обработка ответа и обновление токена при истечении срока действия
$api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Проверка ошибки авторизации
        if (error.response && error.response.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                // Попытка обновления токена
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

                // Сохранение нового токена
                localStorage.setItem('token', response.data.accessToken);

                // Повторный запрос с новым токеном
                return $api.request(originalRequest);
            } catch (e) {
                console.error('Не удалось обновить токен. Пожалуйста, войдите снова.');
                localStorage.removeItem('token'); // Удаление токена при ошибке
                // Перенаправление на страницу входа или другое действие
                // window.location.href = '/login';
                throw e; // Проброс ошибки выше
            }
        }

        // Проброс других ошибок выше
        throw error;
    }
);

export default $api;
