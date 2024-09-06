import React, { useEffect, useState } from 'react';
import AppointmentService from '../services/AppointmentService';
import { IAppointment } from '../models/IAppointment';
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorService from '../services/DoctorService';

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userId = Number(localStorage.getItem('userId'));
                const response = await AppointmentService.getAppointmentsById(userId);
                const appointmentsData = Array.isArray(response.data) ? response.data : [response.data];
                const newData = appointmentsData[0]?.data || [];
                const message = appointmentsData[0]?.message;

                if (message === 'Записи не найдены') {
                    setAppointments([]);
                } else {
                    const filteredAppointments = newData.filter((appointment: IAppointment) => appointment.patient_id === userId);
                    const updatedAppointments = await Promise.all(
                        filteredAppointments.map(async (appointment: IAppointment) => {
                            const newDoctorId = await identifiedDoctor(appointment.doctorId);
                            return {
                                ...appointment,
                                doctorId: newDoctorId
                            };
                        })
                    );
                    setAppointments(updatedAppointments);
                }
            } catch (err) {
                setError('Ошибка при загрузке записей. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const identifiedDoctor = async (oldDoctorId: number) => {
        try {
            const response = await DoctorService.getDoctorById(oldDoctorId);
            // Убедитесь, что response.data - это массив, и получите первый элемент
            const doctors = response.data;
            const doctor = Array.isArray(doctors) ? doctors[0] : doctors; // Если это массив, берём первый элемент
            return doctor.name; // Предполагается, что `doctor` имеет поле `id`
        } catch (err) {
            console.error('Ошибка при получении информации о докторе:', err);
            return oldDoctorId; // В случае ошибки возвращаем старый ID
        }
    };

    const handleDelete = async (appointmentId: number) => {
        try {
            await AppointmentService.deleteAppointment(appointmentId);
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (err) {
            setError('Ошибка при удалении записи. Попробуйте позже.');
        }
    };

    if (loading) {
        return <div className="text-center mt-4">Загрузка...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4">{error}</div>;
    }

    if (appointments.length === 0) {
        return <div className="alert alert-info mt-4">Записей не найдено.</div>;
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Ваши записи</h3>
            <ul className="list-group">
                {appointments.map((appointment) => (
                    <li key={appointment.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="appointment-details">
                            <p><strong>Дата:</strong> {appointment.date}</p>
                            <p><strong>Время:</strong> {appointment.time}</p>
                            <p><strong>Имя Доктора:</strong> {appointment.doctorId}</p>
                        </div>
                        <button className="btn btn-danger" onClick={() => handleDelete(appointment.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentList;
