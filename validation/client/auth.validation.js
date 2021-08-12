const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string(),
        profileImage: Joi.string(),
        description: Joi.string(),
        birthday: Joi.string().required(),
        IdCompteur: Joi.string().required(),
        password: Joi.custom(password).required(),
        longitude: Joi.number(),
        latitude: Joi.number()
    })
}

const update = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        description: Joi.string(),
        profileImage: Joi.string(),
        birthday: Joi.string().required(),
    })
}

const updatePassword = {
    body: Joi.object().keys({
        password: Joi.custom(password).required(),
    })
}

const updateById = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        description: Joi.string(),
        IdCompteur: Joi.string(),
        profileImage: Joi.string(),
        birthday: Joi.string().required(),
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
    getOne
}