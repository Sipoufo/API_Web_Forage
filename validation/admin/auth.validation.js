const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number(),
        email: Joi.string().required(),
        password: Joi.custom(password).required(),
        localisation: Joi.string().required()
    })
}

const login = {
    body: Joi.object().keys({
        number: Joi.string().required(),
        password: Joi.custom(password).required()
    })
}

module.exports = {
    register,
    login,
}