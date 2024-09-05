import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom'; // Импортируйте useNavigate
import styles from '../styles/LoginForm.module.css';

const LoginForm: FC = () => {
    const { store } = useContext(Context);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Используйте useNavigate

    const handleLogin = async () => {
        setError(null);
        const error = await store.login(email, password);
        if (error) {
            setError(error);
        } else {
            navigate('/dashboard'); // Перенаправляем на личный кабинет
        }
        
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.heading}>Вход</h2>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className={styles.error}>{error}</div>}
                <button className={styles.button} onClick={handleLogin}>
                    Войти
                </button>
            </div>
        </div>
    );
};

export default observer(LoginForm);
