const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.array().required(),
        description: Joi.array(),
        subscriptionDate: Joi.string(),
        subscriptionAmount: Joi.number(),
        customerReference: Joi.number(),
        observation: Joi.string(),
        profileImage: Joi.string(),
        IdCompteur: Joi.array(),
        password: Joi.custom(password),
        longitude: Joi.number(),
        latitude: Joi.number()
    })
}

const update = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.array().required(),
        email: Joi.string(),
        profileImage: Joi.string(),
    })
}

const updatePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.custom(password).required(),
        newPassword: Joi.custom(password).required(),
    })
}

const updateById = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.array().required(),
        email: Joi.string(),
        IdCompteur: Joi.array(),
        profileImage: Joi.string(),
    })
}

const login = {
    body: Joi.object().keys({
        phone: Joi.number().required(),
        password: Joi.custom(password).required()
    })
}

const getOne = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    })
}

module.exports = {
    register,
    login,
    update,
    updateById,
    getOne,
    updatePassword
}