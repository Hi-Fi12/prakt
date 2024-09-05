import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import PersonalDetails from '../components/PersonalDetails';
import AppointmentList from '../components/AppointmentList';
import AdminPanel from '../components/AdminPanel'; // Предположим, что это ваша админская панель
import { useStore } from '../store/Store1'; // Предположим, что у вас есть хук useStore для получения хранилища

import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard: React.FC = observer(() => {
    const { store } = useStore(); // Получаем доступ к хранилищу
    const [key, setKey] = React.useState<string>('personalDetails');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Перенаправляем на страницу входа
        }
    }, [navigate]);


    return (
        <div className="dashboard-container">
            <Tabs
                id="dashboard-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k || 'personalDetails')}
                className="mb-3"
            >
                <Tab eventKey="personalDetails" title="Личные данные">
                    <PersonalDetails />
                </Tab>
                <Tab eventKey="appointment" title="Запись ко врачу">
                    <AppointmentForm />
                </Tab>
                <Tab eventKey="appointmentsList" title="Ваши записи">
                    <AppointmentList />
                </Tab>
            </Tabs>
        </div>
    );
});

export default Dashboard;
