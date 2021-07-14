const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const localisation = {
    body: Joi.object().keys({
        longitude: Joi.number().required(),
        latitude: Joi.number().required(),
        descriptionLocalisation: Joi.string().required(),
    })
}

const login = {
    body: Joi.object().keys({
        phone: Joi.number().required(),
        password: Joi.custom(password).required()
    })
}

module.exports = {
    login,
    localisation
}