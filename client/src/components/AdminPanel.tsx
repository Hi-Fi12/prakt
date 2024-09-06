import React, { useEffect, useState } from 'react';
import { IUser } from '../models/IUser';
import { IDoctor } from '../models/IDoctor';
import { IAppointment } from '../models/IAppointment';
import UserService from '../services/UserService';
import AppointmentService from '../services/AppointmentService';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');

    useEffect(() => {
        const fetchUsersAndAppointments = async () => {
            try {
                const [usersResponse, appointmentsResponse] = await Promise.all([
                    UserService.getAllUsers(),
                    AppointmentService.getAllAppointments()
                ]);

                const appointmentsData = Array.isArray(appointmentsResponse) ? appointmentsResponse : [appointmentsResponse];

                setUsers(usersResponse);

                if (appointmentsData[0]?.message === 'Записи не найдены') {
                    setAppointments([]);
                } else {
                    setAppointments(appointmentsData[0]?.data || []);
                }
            } catch (e) {
                setError('Ошибка при получении данных');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndAppointments();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                console.log('Получение списка врачей...');
                const doctorsResponse = await UserService.getAllDoctors();
                const doctorsData = Array.isArray(doctorsResponse) ? doctorsResponse : [doctorsResponse];
                console.log('Врачи:', doctorsData);
                setDoctors(doctorsData);
            } catch (e) {
                setError('Ошибка при получении данных');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const getDoctorNameById = (doctorId: number) => {
        const doctor = doctors.find(doc => doc.id === doctorId);
        return doctor ? doctor.name : 'Неизвестен'; // Возвращает имя доктора или 'Неизвестен', если не найден
    };

    const handleDeleteAppointment = async (appointmentId: number) => {
        try {
            await AppointmentService.deleteAppointment(appointmentId);
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (e) {
            setError('Ошибка при удалении записи');
            console.error(e);
        }
    };

    const handleDeleteDoctor = async (doctorId: number) => {
        try {
            await UserService.deleteDoctor(doctorId);
            setDoctors((prevDoctors) =>
                prevDoctors.filter((doc) => doc.id !== doctorId)
            );
        } catch (e) {
            setError('Ошибка при удалении записи');
            console.error(e);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setError('');
    };

    const handleSave = async () => {
        try {
            // Создайте объект врача с нужными данными
            const response = await UserService.createDoctor({
                name: name,
                specialization: specialization
            });
            
            // Убедитесь, что ответ содержит id и что он имеет правильный тип
            const newDoctor: IDoctor = {
                ...response,
                id: Number(response.id) // Приведение типа id, если нужно
            };
    
            // Обновите состояние
            setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            setError('Ошибка при сохранении данных врача');
        }
    };
    
    if (loading) return <div className="d-flex justify-content-center mt-4"><Spinner animation="border" /></div>;

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h1>Список пользователей</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Активирован</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Дата рождения</th>
                        <th>Пол</th>
                        <th>Телефон</th>
                        <th>Адрес</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.isActivated ? 'Да' : 'Нет'}</td>
                                <td>{user.first_name || 'Не указано'}</td>
                                <td>{user.last_name || 'Не указано'}</td>
                                <td>{user.date_of_birth || 'Не указано'}</td>
                                <td>{user.gender || 'Не указано'}</td>
                                <td>{user.phone_number || 'Не указано'}</td>
                                <td>{user.address || 'Не указано'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>Записи отсутствуют</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <h1 className="mt-4">Записи</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Статус</th>
                        <th>ID пациента</th>
                        <th>Имя врача</th>
                        <th>Действия</th> {/* Добавляем заголовок для кнопок действий */}
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.status}</td>
                                <td>{appointment.patient_id}</td>
                                <td>{getDoctorNameById(appointment.doctorId)}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteAppointment(appointment.id)}>
                                        Удалить
                                    </Button>
                                </td> {/* Добавляем кнопку удаления */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>Записи отсутствуют</td> {/* Обновляем количество объединенных ячеек */}
                        </tr>
                    )}
                </tbody>
            </Table>

            <h1 className="mt-4">Доктора</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Специализация</th>
                        <th>Действия</th> {/* Добавляем заголовок для кнопок действий */}
                    </tr>
                </thead>
                <tbody>
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.id}</td>
                                <td>{doc.name}</td>
                                <td>{doc.specialization}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteDoctor(doc.id)}>
                                        Удалить
                                    </Button>
                                </td> {/* Добавляем кнопку удаления */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>Доктора отсутствуют</td> {/* Обновляем количество объединенных ячеек */}
                        </tr>
                    )}
                    <tr>
                        <td colSpan={4}>
                            <Button onClick={handleEditClick} className="btn btn-primary mt-3">Добавить врача</Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
            {isEditing && (
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Имя:</label>
                        <input
                            id="name"
                            className="form-control"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">Специализация:</label>
                        <input
                            id="specialization"
                            className="form-control"
                            type="text"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary me-2" type="button" onClick={() => setIsEditing(false)}>Отмена</button>
                    <button className="btn btn-primary" type="button" onClick={handleSave}>Сохранить</button>
                </form>
            )}
        </div>
    );
};

export default AdminPage;
