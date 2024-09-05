require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index'); // Убедитесь, что путь к вашему маршрутизатору правильный
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router); // Используйте только один раз для маршрутизации

app.use(errorMiddleware);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Непредвиденная ошибка' });
});

const start = async () => {
    try {
        console.log(`Attempting to start server on port ${PORT}`);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.error('Error starting server:', e);
    }
}

start();
