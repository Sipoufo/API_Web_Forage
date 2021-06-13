const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    query: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        password: Joi.custom(password).required(),
        localisation: Joi.string().required()
    })
}

const login = {
    query: Joi.object().keys({
        phone: Joi.number().required(),
        password: Joi.custom(password).required()
    })
}

module.exports = {
    register,
    login,
}