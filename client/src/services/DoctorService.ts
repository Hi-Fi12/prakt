import $api from "../http";  // Импортируйте вашу настройку для axios
import { AxiosResponse } from 'axios';

// Определите интерфейс для данных врача
export interface Doctor {
    id: string;
    name: string;
    specialization: string;
}

export default class DoctorService {
    // Метод для получения списка врачей
    static async getDoctors(): Promise<AxiosResponse<Doctor[]>> {
        return $api.get<Doctor[]>('/doctors');
    }

    static async getDoctorById(id: number) {
        const response = await $api.get<Doctor[]>(`/doctors/${id}`);
        //console.log('newDoctor:', response);
        //console.log('newDoct25352orId:', response.data);
        return response;
    }
}
