// src/components/DoctorPopup.tsx
import React from 'react';
import styles from '../styles/DoctorPopup.module.css';

interface DoctorPopupProps {
    name: string;
    position: string;
    education: string;
    experience: string;
    specialization: string;
    photo: string;
    isOpen: boolean;
    onClose: () => void;
}

const DoctorPopup: React.FC<DoctorPopupProps> = ({
    name,
    position,
    education,
    experience,
    specialization,
    photo,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <img src={photo} alt={name} className={styles.popupPhoto} />
                <h2>{name}</h2>
                <h3>{position}</h3>
                <p><strong>Образование:</strong> {education}</p>
                <p><strong>Стаж работы:</strong> {experience}</p>
                <p><strong>Чем может помочь:</strong> {specialization}</p>
                <button onClick={onClose} className={styles.closeButton}>Закрыть</button>
                <button className={styles.bookButton}>Записаться</button>
            </div>
        </div>
    );
};

export default DoctorPopup;
