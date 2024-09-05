import $api from "../http";  // Импортируйте вашу настройку для axios
import { AxiosResponse } from 'axios';

// Определите интерфейс для данных врача
export interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

export default class DoctorService {
    // Метод для получения списка врачей
    static async getDoctors(): Promise<AxiosResponse<Doctor[]>> {
        return $api.get<Doctor[]>('/doctors');
    }
}
