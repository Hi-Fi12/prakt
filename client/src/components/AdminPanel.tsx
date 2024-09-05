import React, { useState, useEffect } from 'react';
import DoctorService, { Doctor } from '../services/DoctorService';
import AppointmentService from '../services/AppointmentService';
import UserService from '../services/UserService'; // Импортируйте UserService
import { useNavigate } from 'react-router-dom';


const AppointmentForm: React.FC = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<number | undefined>(undefined);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userDetailsComplete, setUserDetailsComplete] = useState<boolean>(true); // Добавлено состояние для проверки данных пользователя

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await DoctorService.getDoctors();
                setDoctors(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке врачей:', error);
            }
        }
        fetchDoctors();
    }, []);

    useEffect(() => {
        async function checkUserDetails() {
            try {
                const userId = Number(localStorage.getItem('userId'));
                if (isNaN(userId)) {
                    console.error('Invalid user ID');
                    setUserDetailsComplete(false);
                    return;
                }
        
                const userDetails = await UserService.getUserDetails(userId);
                console.log('userDetails:', userDetails);
        
                // Функция для проверки, что строка не пустая и не состоит только из пробелов
                const isNotEmpty = (str: string | undefined) => {
                    if (str === undefined) return false;
                    return str.trim().length > 0;
                };
        
                if (userDetails) {
                    // Проверяем, что все обязательные поля заполнены
                    const {
                        activationLink,
                        address,
                        date_of_birth,
                        email,
                        first_name,
                        gender,
                        last_name,
                        phone_number
                    } = userDetails;
        
                    const isComplete =
                        isNotEmpty(activationLink) &&
                        isNotEmpty(address) &&
                        isNotEmpty(date_of_birth) &&
                        isNotEmpty(email) &&
                        isNotEmpty(first_name) &&
                        isNotEmpty(gender) &&
                        isNotEmpty(last_name) &&
                        isNotEmpty(phone_number);
        
                    setUserDetailsComplete(isComplete);
                } else {
                    setUserDetailsComplete(false);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
                setUserDetailsComplete(false);
            }
        }
        
        
        checkUserDetails();
    }, []);

    const generateTimeSlots = () => {
        const slots: string[] = [];
        let currentTime = new Date();
        currentTime.setHours(8, 0, 0, 0);

        while (currentTime.getHours() < 17 || (currentTime.getHours() === 17 && currentTime.getMinutes() <= 30)) {
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            slots.push(`${hours}:${minutes}`);
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        return slots;
    };

    const fetchAvailableTimes = async (doctorId: number, selectedDate: string) => {
        try {
            console.log(`Запрос доступных времен для доктора ${doctorId} на дату ${selectedDate}`);
            
            const response = await AppointmentService.getAppointmentsByDoctorAndDate(doctorId, selectedDate);
            console.log('Полученные записи:', response.data);
    
            const bookedTimes = response.data.map((appointment: { time: string }) => {
                const [hours, minutes] = appointment.time.split(':');
                return `${hours}:${minutes}`;
            });
            console.log('Забронированные времена:', bookedTimes);
    
            const allTimes = generateTimeSlots();
            console.log('Все возможные времена:', allTimes);
    
            const freeTimes = allTimes.filter(time => !bookedTimes.includes(time));
            console.log('Свободные времена:', freeTimes);
    
            setAvailableTimes(freeTimes);
        } catch (error) {
            console.error('Ошибка при проверке доступных времен:', error);
        }
    };

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.getDay();

        if (dayOfWeek === 0) {
            setErrors(prevErrors => [...prevErrors, 'Нельзя выбрать воскресенье. Пожалуйста, выберите другой день.']);
            setDate('');
        } else {
            setErrors(prevErrors => prevErrors.filter(error => error !== 'Нельзя выбрать воскресенье. Пожалуйста, выберите другой день.'));
            setDate(selectedDate);
            if (selectedDoctor !== undefined) {
                await fetchAvailableTimes(selectedDoctor, selectedDate);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: string[] = [];
    
        if (!userDetailsComplete) {
            newErrors.push('Пожалуйста, заполните все необходимые данные профиля перед записью на прием.');
        }
        if (selectedDoctor === undefined) {
            newErrors.push('Выберите врача.');
        }
        if (!date) {
            newErrors.push('Выберите дату.');
        }
        if (!time) {
            newErrors.push('Выберите время.');
        }
    
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
    
        try {
            const patient_id = Number(localStorage.getItem('userId'));
            if (!patient_id) {
                throw new Error('Пользователь не авторизован');
            }
    
            const response = await AppointmentService.createAppointment(selectedDoctor!, date, time, patient_id);
            console.log('Запись создана:', response.data);
            setSuccessMessage('Запись успешно создана!');
            setErrors([]);
            setDate('');
            setTime('');
            setSelectedDoctor(undefined);
            setAvailableTimes([]);
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
        }
    };

    const timeSlots = availableTimes.length > 0 ? availableTimes : generateTimeSlots();

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(minDate);
    maxDate.setDate(minDate.getDate() + 6);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
                <div>
                    {errors.map((error, index) => (
                        <p key={index} style={{ color: 'red' }}>{error}</p>
                    ))}
                </div>
            )}
            {successMessage && (
                <div style={{ color: 'green' }}>
                    <p>{successMessage}</p>
                </div>
            )}
            <div>
                <label htmlFor="doctor">Выберите врача:</label>
                <select
                    id="doctor"
                    value={selectedDoctor ?? ''}
                    onChange={(e) => {
                        const doctorId = Number(e.target.value);
                        setSelectedDoctor(doctorId);
                        if (date) {
                            fetchAvailableTimes(doctorId, date);
                        }
                    }}
                >
                    <option value="">Выберите врача</option>
                    {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="date">Дата:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    min={formatDate(minDate)}
                    max={formatDate(maxDate)}
                    onChange={handleDateChange}
                />
            </div>
            <div>
                <label htmlFor="time">Время:</label>
                <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={availableTimes.length === 0}
                >
                    <option value="">Выберите время</option>
                    {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Создать запись</button>
        </form>
    );
};

export default AppointmentForm;
