const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const { warn } = require('console');

class TokenService{
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'});

        console.log("Smotri tuta",accessToken, refreshToken);

        return{
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({
            where: { userId: userId }
          });        
          if (tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({userId: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.destroy({where:{refreshToken}});
        return tokenData;
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch (e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch (e){
            return null;
        }
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({where:{refreshToken}});
        return tokenData;
    }
}

module.exports = new TokenService();