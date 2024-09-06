const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const AppointmentController = require('../controllers/appointment-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const doctorController = require('../controllers/doctor-controller');

router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/appointments', AppointmentController.getAll); // Убедитесь, что метод getAll существует в AppointmentController

router.post('/appointments', AppointmentController.create); // Убедитесь, что метод create существует в AppointmentController
router.get('/doctors', doctorController.getDoctors);
router.get('/appointments/by-doctor-and-date', AppointmentController.getAppointmentsByDoctorAndDate);
router.get('/appointments/:id', AppointmentController.getAllById); // Убедитесь, что метод getAll существует в AppointmentController
router.get('/users/:id', userController.getUserDetails);
router.get('/doctors/:id', doctorController.getDoctorById);
router.get('/all_users', userController.getAllUsers);

router.get('/all_appointments', AppointmentController.getAllAppointments);

router.put('/users/:id', userController.updateUserDetails); // Метод PUT для обновления данных
router.put('/newdoctor/', doctorController.create); // Метод PUT для обновления данных


router.get('/users/:id', userController.getUserById);
router.delete('/appointments/:id', AppointmentController.delete);
router.delete('/doctor/:id', doctorController.delete);
module.exports = router;
