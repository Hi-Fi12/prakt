// src/pages/Services.tsx
import React, { useState } from 'react';
import styles from '../styles/Services.module.css';
import { useNavigate } from 'react-router-dom';

interface Service {
    name: string;
    description: string;
    cost: string;
}

interface Category {
    title: string;
    services: Service[];
}

const categories: Category[] = [
    {
        title: 'Терапевтическое лечение',
        services: [
            {
                name: 'Чистка зубов',
                description: 'Глубокая чистка зубов с использованием ультразвука и профессиональных средств.',
                cost: '3 000₽',
            },
            {
                name: 'Лечение кариеса',
                description: 'Удаление кариозных поражений и восстановление зуба с помощью пломбы.',
                cost: '2 500₽',
            },
        ],
    },
    {
        title: 'Хирургия',
        services: [
            {
                name: 'Удаление зуба',
                description: 'Хирургическое удаление зубов, включая сложные случаи.',
                cost: '5 000₽',
            },
            {
                name: 'Синус-лифтинг',
                description: 'Процедура повышения уровня костной ткани для установки имплантов.',
                cost: '12 000₽',
            },
        ],
    },
    {
        title: 'Ортопедия',
        services: [
            {
                name: 'Установка коронки',
                description: 'Установка коронки для восстановления формы и функции зуба.',
                cost: '8 000₽',
            },
            {
                name: 'Установка мостов',
                description: 'Мостовидные протезы для восстановления утраченных зубов.',
                cost: '15 000₽',
            },
        ],
    },
    {
        title: 'Имплантация зубов',
        services: [
            {
                name: 'Установка импланта',
                description: 'Установка зубного имплантата для замены утраченных зубов.',
                cost: '20 000₽',
            },
            {
                name: 'Периодическая проверка импланта',
                description: 'Регулярная проверка состояния зубных имплантатов.',
                cost: '3 000₽',
            },
        ],
    },
    {
        title: 'Косметическая стоматология',
        services: [
            {
                name: 'Отбеливание зубов',
                description: 'Процедура отбеливания зубов для достижения белоснежной улыбки.',
                cost: '5 000₽',
            },
            {
                name: 'Профессиональная гигиена полости рта',
                description: 'Удаление зубного налета и камня с помощью современных технологий.',
                cost: '4 000₽',
            },
        ],
    },
];

const Services: React.FC = () => {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

    const handleCategoryClick = (index: number) => {
        setActiveCategoryIndex(index);
    };

    const navigate = useNavigate();
    const handleBookButtonClick = () => {
        navigate('/dashboard'); // Замените '/dashboard' на путь к вашей странице
    };

    const selectedCategory = categories[activeCategoryIndex];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Наши Услуги</h1>
            <div className={styles.tabs}>
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className={`${styles.tab} ${activeCategoryIndex === index ? styles.activeTab : ''}`}
                        onClick={() => handleCategoryClick(index)}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
            <div className={styles.servicesList}>
                {selectedCategory.services.map((service, index) => (
                    <div key={index} className={styles.service}>
                        <h3>{service.name}</h3>
                        <p><strong>Описание:</strong> {service.description}</p>
                        <p><strong>Стоимость:</strong> {service.cost}</p>
                        <button className={styles.bookButton} onClick={handleBookButtonClick}>Записаться</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
