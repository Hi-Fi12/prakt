import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import styles from '../styles/SignupForm.module.css';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const SignupForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { store } = useContext(Context);
    const navigate = useNavigate(); // Хук для перенаправления

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleRegister = async () => {
        setError(null);

        if (!validateEmail(email)) {
            setError('Некорректный формат email');
            return;
        }

        if (password.length < 3) {
            setError('Пароль должен содержать минимум 3 символа');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const registrationError = await store.registration(email, password);
        if (registrationError) {
            setError(registrationError);
        } else {
            navigate('/login'); // Перенаправляем на страницу входа при успешной регистрации
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.heading}>Регистрация</h2>
                {error && <div className={styles.error}>{error}</div>}
                <input
                    className={styles.input}
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="Email"
                />
                <input
                    className={styles.input}
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Пароль"
                />
                <input
                    className={styles.input}
                    onChange={e => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type="password"
                    placeholder="Повторите пароль"
                />
                <button className={styles.button} onClick={handleRegister}>
                    Регистрация
                </button>
            </div>
        </div>
    );
};

export default observer(SignupForm);
