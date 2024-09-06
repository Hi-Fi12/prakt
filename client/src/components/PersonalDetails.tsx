import React, { useEffect, useState } from 'react';
import UserService, { User } from '../services/UserService';
import '../styles/PersonalDetails.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const PersonalDetails: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchedUser = await UserService.getUserDetails(Number(localStorage.getItem('userId')));
                setUser(fetchedUser);
                setFirstName(fetchedUser.first_name || '');
                setLastName(fetchedUser.last_name || '');
                setDateOfBirth(fetchedUser.date_of_birth || '');
                setGender(fetchedUser.gender || '');
                setPhoneNumber(fetchedUser.phone_number || '');
                setAddress(fetchedUser.address || '');
            } catch (err) {
                setError('Ошибка при загрузке данных пользователя');
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            if (user) {
                const updatedUser = await UserService.updateUserDetails(user.id, {
                    first_name: firstName,
                    last_name: lastName,
                    email: user.email, // Используем текущее значение email
                    date_of_birth: dateOfBirth,
                    gender: gender === '' ? undefined : gender,
                    phone_number: phoneNumber,
                    address
                });
                setUser(updatedUser);
                setIsEditing(false);
                window.location.reload();
            }
        } catch (err) {
            setError('Ошибка при сохранении данных пользователя');
        }
        // window.location.reload(); // Не рекомендуется, так как перезагружает страницу. Обновление состояния достаточно.
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setError('');
    };

    return (
        <div className="container mt-4 mb-4">
            <h2 className="mb-4">Личные данные</h2>
            {error && <p className="text-danger">{error}</p>}
            {user ? (
                <div>
                    {isEditing ? (
                        <form>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Имя:</label>
                                <input
                                    id="firstName"
                                    className="form-control"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Фамилия:</label>
                                <input
                                    id="lastName"
                                    className="form-control"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dateOfBirth" className="form-label">Дата рождения:</label>
                                <input
                                    id="dateOfBirth"
                                    className="form-control"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Пол:</label>
                                <select
                                    id="gender"
                                    className="form-select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                                >
                                    <option value="">Не указано</option>
                                    <option value="Male">Мужской</option>
                                    <option value="Female">Женский</option>
                                    <option value="Other">Другой</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Телефон:</label>
                                <input
                                    id="phoneNumber"
                                    className="form-control"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Адрес:</label>
                                <input
                                    id="address"
                                    className="form-control"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-secondary me-2" type="button" onClick={() => setIsEditing(false)}>Отмена</button>
                            <button className="btn btn-primary" type="button" onClick={handleSave}>Сохранить</button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Имя:</strong> {user.first_name}</p>
                            <p><strong>Фамилия:</strong> {user.last_name}</p>
                            <p><strong>Электронная почта:</strong> {user.email}</p>
                            <p><strong>Дата рождения:</strong> {user.date_of_birth}</p>
                            <p><strong>Пол:</strong> {user.gender || 'Не указан'}</p>
                            <p><strong>Телефон:</strong> {user.phone_number || 'Не указан'}</p>
                            <p><strong>Адрес:</strong> {user.address || 'Не указан'}</p>
                            <button className="btn btn-primary" onClick={handleEditClick}>Редактировать</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
};

export default PersonalDetails;
