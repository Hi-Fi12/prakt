// src/components/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>Контакты</h3>
                    <p>Адрес: ул. Примерная, д. 1, г. Москва</p>
                    <p>Телефон: +7 (123) 456-78-90</p>
                    <p>Email: info@dentalclinic.ru</p>
                </div>
                <div className={styles.column}>
                    <h3>Навигация</h3>
                    <ul className={styles.navLinks}>
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/services">Услуги</Link></li>
                        <li><Link to="/specialists">Специалисты</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Социальные сети</h3>
                    <ul className={styles.socialLinks}>
                        <li><a href="#">Telegram</a></li>
                        <li><a href="#">Discord</a></li>
                        <li><a href="#">ВКонтакте</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Рабочие часы</h3>
                    <p>Пн-Пт: 9:00 - 18:00</p>
                    <p>Сб: 10:00 - 16:00</p>
                </div>
            </div>
            <div className={styles.copyright}>
                <p>&copy; 2024 Dental Clinic. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
