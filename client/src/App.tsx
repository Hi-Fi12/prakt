import React, { FC, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import SpecialistsPage from './pages/SpecialistsPage';
import Dashboard from './pages/Dashboard';
import { observer } from 'mobx-react-lite';
import './styles/App.module.css';
import {Context} from "./index";


const App: FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    return (
        <Router>
            <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/specialists" element={<SpecialistsPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            <Footer />
        </Router>
    );
};

export default observer(App);
