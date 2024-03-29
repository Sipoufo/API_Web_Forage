const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const localisation = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        longitude: Joi.number().required(),
        latitude: Joi.number().required(),
        description: Joi.string(),
    })
}

const login = {
    body: Joi.object().keys({
        phone: Joi.number().required(),
        password: Joi.custom(password).required(),
    })
}

module.exports = {
    login,
    localisation
}