const sequelize = require("sequelize")
const users = require("../models/users")
const { Validator } = require('node-input-validator');
const jwt = require("jsonwebtoken")
const helper = require("../middleWare/helper")
const secretCryptoKey = process.env.jwtSecretKey;
const SECRET_KEY = "$2b$10$3jcx0dmyglhk4e9tab78veuJ5.xyhIVOw4C5x1tTERPtmW2vgV9H6";
const PUBLISH_KEY = "$2b$10$05bVxGorEg/GGQB8Ubd54enCDziBkTHb5IcIcq/085XD7UqN/PfHi";
const secretKey = "123456"

module.exports = {
    authenticateHeader: async function (req, res, next) {
        const v = new Validator(req.headers, {
            secret_key: 'required|string',
            publish_key: 'required|string',
        });

        let errorsResponse = await helper.checkValidation(v);
        if (errorsResponse) {
            return helper.failed(res, errorsResponse);
        }
        if (
            req.headers.secret_key !== SECRET_KEY ||
            req.headers.publish_key !== PUBLISH_KEY
        ) { return helper.failed(res, 'Key not matched!') }
        next();
    },

    authenticateJWT: async (req, res, next) => {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            const secretCryptoKey = process.env.jwtSecretKey;
            jwt.verify(token, secretCryptoKey, async (err, payload) => {
                if (err) {
                    return res.sendStatus(403)
                }
                const existinUser = await users.findOne({
                    where: {
                        _id: payload.id,
                        loginTime: payload.loginTime
                    }
                });
                if (existinUser) {
                    req.user = existinUser;
                    next();
                } else {
                    return res.status(401).json({
                        success: false,
                        code: 401,
                        message: 'Unauthorized',
                        body: {},
                    })
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                code: 401,
                message: 'Unauthorized',
                body: {},
            })
        }
    },



    verifyUser: async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log('object');
            jwt.verify(token, secretCryptoKey, async (err, payload) => {
                if (err) {
                    return res.sendStatus(403);
                }
                // console.log('object,,,,,,,,', payload.data.id);
                const existingUser = await userModel.findOne({
                    where: {
                        id: payload.data.id,
                        login_time: payload.data.login_time,
                    },
                });
                // console.log('existingUser,,,,,,,,,,,,,,,,,', existingUser);
                if (existingUser) {
                    req.user = existingUser;
                    next();
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.sendStatus(401);
        }
    },


}