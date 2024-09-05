// components/PersonalDetails.tsx
import React, { useEffect, useState } from 'react';
import UserService, { User } from '../services/UserService';

const PersonalDetails: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
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
                console.log(fetchedUser);
                setUser(fetchedUser);
                setFirstName(fetchedUser.first_name || '');
                setLastName(fetchedUser.last_name || '');
                setEmail(fetchedUser.email);
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
                    email,
                    date_of_birth: dateOfBirth,
                    gender: gender === '' ? undefined : gender,
                    phone_number: phoneNumber,
                    address
                });
                setUser(updatedUser);
                setIsEditing(false);
            }
        } catch (err) {
            setError('Ошибка при сохранении данных пользователя');
        }
        window.location.reload();
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setError('');
    };

    return (
        <div>
            <h2>Личные данные</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <div>
                    {isEditing ? (
                        <div>
                            <div>
                                <label htmlFor="firstName">Имя:</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName">Фамилия:</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Электронная почта:</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="dateOfBirth">Дата рождения:</label>
                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender">Пол:</label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                                >
                                    <option value="">Не указано</option>
                                    <option value="Male">Мужской</option>
                                    <option value="Female">Женский</option>
                                    <option value="Other">Другой</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="phoneNumber">Телефон:</label>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="address">Адрес:</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setIsEditing(false)}>Отмена</button>
                            <button onClick={handleSave}>Сохранить</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Имя:</strong> {user.first_name}</p>
                            <p><strong>Фамилия:</strong> {user.last_name}</p>
                            <p><strong>Электронная почта:</strong> {user.email}</p>
                            <p><strong>Дата рождения:</strong> {user.date_of_birth}</p>
                            <p><strong>Пол:</strong> {user.gender || 'Не указан'}</p>
                            <p><strong>Телефон:</strong> {user.phone_number || 'Не указан'}</p>
                            <p><strong>Адрес:</strong> {user.address || 'Не указан'}</p>
                            <button onClick={handleEditClick}>Редактировать</button>
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
