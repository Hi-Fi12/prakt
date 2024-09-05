import React, { useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";

const Header: React.FC = observer(() => {
    const { store } = useContext(Context);
    const navigate = useNavigate(); // Hook для программной навигации

    const handleLogout = async () => {
        await store.logout(); // Выполните выход
        navigate('/'); // Перенаправьте на главную страницу
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Dental Clinic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Главная</Nav.Link>
                        <Nav.Link as={Link} to="/services">Услуги</Nav.Link>
                        <Nav.Link as={Link} to="/specialists">Специалисты</Nav.Link>
                    </Nav>
                    <Nav className="d-flex align-items-center">
                        {store.isAuth ? (
                            <>
                                <span className="me-2">Пользователь: {store.user?.email}</span>
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => navigate('/dashboard')} // Перенаправление на страницу профиля
                                    className="me-2"
                                >
                                    Личный кабинет
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="outline-success" 
                                    onClick={() => navigate('/login')} 
                                    className="me-2"
                                >
                                    Вход
                                </Button>
                                <Button 
                                    variant="success" 
                                    onClick={() => navigate('/signup')}
                                >
                                    Регистрация
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default Header;
