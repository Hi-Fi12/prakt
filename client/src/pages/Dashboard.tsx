import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Tabs, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import PersonalDetails from '../components/PersonalDetails';
import AppointmentList from '../components/AppointmentList';
import AdminPanel from '../components/AdminPanel';
import { useStore } from '../store/Store1';
import '../styles/Dashboard.module.css';
import '../styles/PersonalDetails.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard: React.FC = observer(() => {
    const { store } = useStore();
    const [key, setKey] = useState<string>('appointmentsList');
    const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Состояние для админских прав
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Перенаправляем на страницу входа
        } else {
            // Эмулируем асинхронную проверку роли пользователя
            const checkAdminStatus = async () => {
                try {
                    // Добавляем искусственную задержку для эмуляции асинхронной проверки
                    await new Promise((resolve) => setTimeout(resolve, 500)); // 500 мс задержки

                    const adminStatus = localStorage.getItem('isAdmin');
                    setIsAdmin(Boolean(adminStatus));
                } catch (error) {
                    console.error('Ошибка при проверке роли пользователя:', error);
                } finally {
                    setLoading(false); // Завершаем загрузку после проверки
                }
            };

            checkAdminStatus();
        }
    }, [navigate]);

    if (loading) {
        return <div>Загрузка...</div>; // Показать индикатор загрузки
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Tabs
                        id="dashboard-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k || 'personalDetails')}
                        className="mb-3"
                        fill
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
                        {isAdmin && ( // Условный рендеринг вкладки для администратора
                            <Tab eventKey="adminPanel" title="Админ панель">
                                <AdminPanel />
                            </Tab>
                        )}
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
});

export default Dashboard;
