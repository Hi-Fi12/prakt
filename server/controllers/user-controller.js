const userService = require("../service/user-service");
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserController{
    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 3600 * 1000, httpOnly: true})
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }

    async login(req, res, next) {
        try{
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 3600 * 1000, httpOnly: true})
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }


    async activate(req, res, next) {
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch (e){
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    

    async getUserDetails(req, res, next) {
        try {
            const userId = req.params.id;
            //console.log(`Получение пользователя с ID: ${userId}`); // Логируем ID
            const user = await userService.getUserById(userId);
            //console.log("Полученный пользователь:", user);
            res.json(user);
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
            next(error);
        }
    }

    async updateUserDetails(req, res, next) {
        try {
            // Логируем входные параметры
            console.log('Контроллер updateUserDetails вызвана с параметрами:', { 
                userId: req.params.id, 
                userData: req.body 
            });
    
            const userId = req.params.id;
            const { email, first_name, last_name, date_of_birth, gender, phone_number, address } = req.body; // Добавьте другие поля, если нужно
    
            // Логируем данные, которые будут обновлены
            //console.log('Контроллер Обновляем данные пользователя:', { email, first_name, last_name, date_of_birth, gender, phone_number, address });
    
            // Обновите данные пользователя
            const updatedUser = await userService.updateUser(userId, { email, first_name, last_name, date_of_birth, gender, phone_number, address });
    
            // Логируем обновленного пользователя
            //console.log('Контроллер Обновленный пользователь:', updatedUser);
    
            // Преобразование данных пользователя в DTO, если требуется
            const userDto = new UserDto(updatedUser);
    
            // Логируем преобразованный DTO
            //console.log('Контроллер Возвращаемый DTO:', userDto);
    
            return res.json(userDto);
        } catch (e) {
            // Логируем ошибку
            console.error('Контроллер Ошибка при обновлении данных пользователя:', e);
            next(e);
        }
    }
    

    async getUserById(userId) {
        try {
            //console.log(`Поиск пользователя с ID: ${userId}`); // Логируем ID
            const user = await UserModel.findByPk(userId);
            if (!user) {
                //console.log(`Пользователь с ID ${userId} не найден`); // Логируем отсутствие пользователя
                throw ApiError.NotFound('Пользователь не найден');
            }
            return user;
        } catch (error) {
            console.error('Ошибка в getUserById:', error);
            throw ApiError.InternalServerError('Ошибка сервера при получении пользователя');
        }
    }
}

module.exports = new UserController();