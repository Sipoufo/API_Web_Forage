const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.array(),
        description: Joi.array().default([]),
        subscriptionDate: Joi.string(),
        subscriptionAmount: Joi.number(),
        customerReference: Joi.number().required(),
        observation: Joi.string(),
        profileImage: Joi.string(),
        idCompteur: Joi.array().default([]),
        password: Joi.custom(password),
        longitude: Joi.number(),
        latitude: Joi.number()
    })
}

const update = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.array().default([]),
        description: Joi.array().default([]),
        subscriptionDate: Joi.string(),
        subscriptionAmount: Joi.number(),
        customerReference: Joi.number().required(),
        observation: Joi.string(),
        profileImage: Joi.string(),
        idCompteur: Joi.array().default([]),
        password: Joi.custom(password),
        longitude: Joi.number(),
        latitude: Joi.number()
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
        phone: Joi.array().default([]),
        description: Joi.array().default([]),
        subscriptionDate: Joi.string(),
        subscriptionAmount: Joi.number(),
        customerReference: Joi.number().required(),
        observation: Joi.string(),
        profileImage: Joi.string(),
        idCompteur: Joi.array().default([]),
        password: Joi.custom(password),
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