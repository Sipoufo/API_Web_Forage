const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string(),
        description: Joi.string(),
        birthday: Joi.string().required(),
        IdCompteur: Joi.string().required(),
        password: Joi.custom(password).required(),
        longitude: Joi.number(),
        latitude: Joi.number()
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