// src/pages/Home.tsx

import React from 'react';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <section className={styles.clinicInfo}>
                <div className={styles.container}>
                    <h1>Добро пожаловать в Dental Clinic</h1>
                    <p>
                        Наша клиника предлагает широкий спектр стоматологических услуг, включая терапию, ортопедию, 
                        ортодонтию и имплантацию. Мы используем современное оборудование и новейшие методы лечения, 
                        чтобы обеспечить максимальный комфорт и качество обслуживания для наших пациентов.
                    </p>
                    <p>
                        В команде клиники работают опытные специалисты, которые регулярно повышают свою квалификацию 
                        и внедряют передовые технологии в свою практику. Наша миссия — помогать людям обрести 
                        здоровую и красивую улыбку.
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Наши Услуги</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Терапевтическое лечение</li>
                    <li className={styles.listItem}>Хирургия</li>
                    <li className={styles.listItem}>Ортопедия</li>
                    <li className={styles.listItem}>Имплантация зубов</li>
                    <li className={styles.listItem}>Косметическая стоматология</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Наши Специалисты</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Доктор Иванов — Терапевт</li>
                    <li className={styles.listItem}>Доктор Петров — Хирург</li>
                    <li className={styles.listItem}>Доктор Сидоров — Ортопед</li>
                    <li className={styles.listItem}>Доктор Смирнова — Имплантолог</li>
                    <li className={styles.listItem}>Доктор Кузнецова — Косметолог</li>
                </ul>
            </section>

            <section className={styles.gallery}>
                <div className={styles.container}>
                    <h2>Наша клиника</h2>
                    <div className={styles.images}>
                        <img src="https://via.placeholder.com/300" alt="Кабинет 1" />
                        <img src="https://via.placeholder.com/300" alt="Кабинет 2" />
                        <img src="https://via.placeholder.com/300" alt="Кабинет 3" />
                        <img src="https://via.placeholder.com/300" alt="Кабинет 4" />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
