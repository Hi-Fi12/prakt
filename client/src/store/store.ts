import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import AppointmentService from "../services/AppointmentService"; // Импортируйте новый сервис
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import { IAppointment } from "../models/IAppointment"; // Импортируйте модель записи
import { AxiosError } from 'axios';
//import UserService from "../services/UserService";

function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    isAdmin = false;
    appointments: IAppointment[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
        if (user.id) {
            localStorage.setItem('userId', user.id.toString());
        }
    }

    setAppointments(appointments: IAppointment[]) {
        this.appointments = appointments;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setAdmin(bool: boolean) {
        this.isAdmin = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
           // await this.checkUserRole();
            return null;
        } catch (e: any) {
            if (e.response && e.response.data) {
                return e.response.data.message || 'Ошибка при входе';
            } else {
                return 'Ошибка при входе';
            }
        }
    }

    


    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            //console.log('Регистрация успешна:', response);
            localStorage.setItem('token', response.data.accessToken);
            return null; // Возвращаем null, если нет ошибки
        } catch (e: any) {
            console.error('Ошибка при регистрации:', e);
            if (e.response && e.response.data) {
                return e.response.data.message || 'Ошибка при регистрации';
            } else {
                return 'Ошибка при регистрации';
            }
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            this.setAuth(false);
            this.setUser({} as IUser);
            this.setAdmin(false);
        } catch (e) {
            //console.log('Ошибка при выходе:', e);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
                
                localStorage.setItem('token', response.data.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            } else {
                this.setAuth(false);
            }
        } catch (e) {
            console.error('Ошибка проверки аутентификации:', e);
            this.setAuth(false);
            localStorage.removeItem('token');
        } finally {
            this.setLoading(false);
        }
    }
    
    
    async fetchAppointments() {
        this.setLoading(true);
        try {
            const response = await AppointmentService.getAppointments();
            this.setAppointments(response.data);
        } catch (error: unknown) {
            console.error('Ошибка при получении записей:', error);
            if (isAxiosError(error)) {
                console.error('HTTP статус ошибки:', error.response?.status);
                console.error('Сообщение ошибки:', error.message);
                console.error('Полный объект ошибки:', error.response?.data);
            } else {
                console.error('Неизвестная ошибка:', error);
            }
        } finally {
            this.setLoading(false);
        }
    }

    async createAppointment(
        doctorId: number,
        date: string,
        time: string,
        patient_id: number
    ) {
        try {
            const response = await AppointmentService.createAppointment(doctorId, date, time, patient_id);
            this.setAppointments([...this.appointments, response.data]);
        } catch (e) {
            console.error('Ошибка при создании записи:', e);
        }
    }
}
    

