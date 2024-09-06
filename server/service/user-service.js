const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');


class UserService{
    async registration(email, password){
        const candidate = await UserModel.findOne({
            where: { email: email }
        });
        if (candidate){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password,5);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`); 

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({where: {activationLink}});
        if (!user){
            ApiError.BadRequest('Неккоректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким почтовым адресом не найден');
        }
    
        if (!user.isActivated) {
            throw ApiError.BadRequest('Аккаунт не активирован. Проверьте вашу почту для активации.');
        }
    
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
    
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {
            ...tokens,
            user: userDto
        };
    }
    

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        
        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
  
            throw ApiError.UnauthorizedError();
        }
        
        const tokenFromDb = await tokenService.findToken(refreshToken);
        
        if (!tokenFromDb) {
            console.log("!1231231govno",refreshToken);
            throw ApiError.UnauthorizedError();
        }
        
        const user = await UserModel.findByPk(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
           return {
            ...tokens,
            user: userDto,
        };
    }
    

    async getUserById(userId) {
        try {
            //console.log(`Поиск пользователя с ID: ${userId}`); // Логируем ID
            const user = await UserModel.findByPk(userId);
            if (!user) {
                console.log(`Пользователь с ID ${userId} не найден`); // Логируем отсутствие пользователя
                throw ApiError.NotFound('Пользователь не найден');
            }
            return user;
        } catch (error) {
            console.error('Ошибка в getUserById:', error);
            throw ApiError.InternalServerError('Ошибка сервера при получении пользователя');
        }
    }


    async updateUser(userId, updates) {
        try {
            // Логируем входные параметры функции
            //console.log('updateUser called with:', { userId, updates });
    
            // Поиск пользователя по ID
            //console.log('Поиск пользователя с ID:', userId);
            const user = await UserModel.findByPk(userId);
            if (!user) {
                console.error('Пользователь не найден с ID:', userId);
                throw ApiError.NotFound('Пользователь не найден');
            }
    
            // Логируем найденного пользователя
            //console.log('Найденный пользователь:', user);
    
            // Обновление данных пользователя
            //console.log('Обновление данных пользователя:', updates);
            await user.update(updates);
    
            // Логируем обновленного пользователя
            //console.log('Обновленный пользователь:', user);
    
            // Возвращение обновленного пользователя
            return user;
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            throw ApiError.BadRequest('Ошибка при обновлении пользователя');
        }
    }
    
    async  findAll() {
        //console.log('Поиск всех пользователей');
        const users = await UserModel.findAll();
        const userData = users.map(user => user.dataValues);

        //console.log("Найденные пользователи:", userData);
        //console.log('Найденные пользователи:', users);
        return userData;
    }

    
}



module.exports = new UserService();