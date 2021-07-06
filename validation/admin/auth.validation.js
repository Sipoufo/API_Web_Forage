const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        birthday: Joi.string().required(),
        password: Joi.custom(password).required(),
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    })
}

const login = {
    body: Joi.object().keys({
        phone: Joi.number().required(),
        password: Joi.custom(password).required()
    })
}

module.exports = {
    register,
    login,
}