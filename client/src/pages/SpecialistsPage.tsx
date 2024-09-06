// src/pages/Specialists.tsx
import React, { useState } from 'react';
import styles from '../styles/Specialists.module.css';
import DoctorPopup from '../components/DoctorPopup';

interface Doctor {
    fullName: string;
    position: string;
    education: string;
    experience: string;
    specialization: string;
    photo: string;
}

const doctors: Doctor[] = [
    {
        fullName: 'Иванов Иван Иванович',
        position: 'Терапевт',
        education: 'Московский государственный медико-стоматологический университет',
        experience: '10 лет',
        specialization: 'Диагностика и лечение заболеваний зубов и десен',
        photo: 'https://via.placeholder.com/300', // Путь к фото
    },
    {
        fullName: 'Петров Петр Петрович',
        position: 'Хирург',
        education: 'Санкт-Петербургская государственная медицинская академия',
        experience: '15 лет',
        specialization: 'Хирургическое лечение сложных заболеваний полости рта',
        photo: 'https://via.placeholder.com/300',
    },
    {
        fullName: 'Сидоров Сергей Сергеевич',
        position: 'Ортопед',
        education: 'Казанский государственный медицинский университет',
        experience: '12 лет',
        specialization: 'Установка протезов и коррекция зубного ряда',
        photo: 'https://via.placeholder.com/300',
    },
    {
        fullName: 'Смирнова Анна Александровна',
        position: 'Имплантолог',
        education: 'Новосибирский государственный медицинский университет',
        experience: '8 лет',
        specialization: 'Установка зубных имплантатов и восстановление утраченных зубов',
        photo: 'https://via.placeholder.com/300',
    },
    {
        fullName: 'Кузнецова Мария Викторовна',
        position: 'Косметолог',
        education: 'Уральский государственный медицинский университет',
        experience: '9 лет',
        specialization: 'Эстетическая стоматология и коррекция улыбки',
        photo: 'https://via.placeholder.com/300',
    },
];

const Specialists: React.FC = () => {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const openPopup = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
    };

    const closePopup = () => {
        setSelectedDoctor(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Наши Специалисты</h1>
            <ul className={styles.list}>
                {doctors.map((doctor, index) => (
                    <li
                        key={index}
                        className={styles.listItem}
                        onClick={() => openPopup(doctor)}
                    >
                        <img src={doctor.photo} alt={doctor.fullName} className={styles.doctorPhoto} />
                        {doctor.fullName} — {doctor.position}
                    </li>
                ))}
            </ul>
            {selectedDoctor && (
                <DoctorPopup
                    name={selectedDoctor.fullName}
                    position={selectedDoctor.position}
                    education={selectedDoctor.education}
                    experience={selectedDoctor.experience}
                    specialization={selectedDoctor.specialization}
                    photo={selectedDoctor.photo}
                    isOpen={!!selectedDoctor}
                    onClose={closePopup}
                />
            )}
        </div>
    );
};

export default Specialists;
