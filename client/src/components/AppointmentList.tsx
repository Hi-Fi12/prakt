import React, { useEffect, useState } from 'react';
import AppointmentService from '../services/AppointmentService';
import { IAppointment } from '../models/IAppointment';

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await AppointmentService.getAppointmentsById(Number(localStorage.getItem('userId')));
                console.log('Appointments data:', response.data);
                const appointmentsData = Array.isArray(response.data) ? response.data : [response.data]; // Преобразование в массив
                


                const message = appointmentsData[0]?.message; // Получение сообщения из appointmentsData

            if (message === 'Записи не найдены') {
                setAppointments([]); // Устанавливаем пустой массив
                console.log('No appointments found');
            } else {
                setAppointments(appointmentsData[0]?.data || []); // Устанавливаем данные или пустой массив
                console.log('Appointments appointmentsData:', appointmentsData[0]?.data);
                
            }
            } catch (err) {
                setError('Ошибка при загрузке записей. Попробуйте позже.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };



        fetchAppointments();
    }, []);

    const handleDelete = async (appointmentId: number) => {
        try {
            await AppointmentService.deleteAppointment(appointmentId); // Ensure this method exists in your service
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (err) {
            setError('Ошибка при удалении записи. Попробуйте позже.');
            console.error(err);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (appointments.length === 0) {
        return <div>Записей не найдено.</div>;
    }

    return (
        <div className="appointment-list">
            <h3>Ваши записи</h3>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-item">
                        <div className="appointment-details">
                            <p><strong>Дата:</strong> {appointment.date}</p>
                            <p><strong>Время:</strong> {appointment.time}</p>
                            <p><strong>ID Доктора:</strong> {appointment.doctorId}</p>
                        </div>
                        <button onClick={() => handleDelete(appointment.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentList;
