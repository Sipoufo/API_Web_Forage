const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string(),
        description: Joi.string(),
        profileImage: Joi.string(),
        password: Joi.custom(password),
        longitude: Joi.number(),
        latitude: Joi.number()
    })
}

const update = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string(),
        description: Joi.string(),
        profileImage: Joi.string(),
    })
}

const updateById = {
    params: Joi.object().keys({
        idAdmin: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string(),
        description: Joi.string(),
        profileImage: Joi.string(),
    })
}

const login = {
    body: Joi.object().keys({
        phone: Joi.string().required(),
        password: Joi.custom(password).required()
    })
}

const getAdmin = {
    params: Joi.object().keys({
        idAdmin: Joi.custom(objectId).required()
    })
}

const getClients = {
    params: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
    }),
}

const updatePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.custom(password).required(),
        newPassword: Joi.custom(password).required(),
    })
}

module.exports = {
    register,
    login,
    update,
    getClients,
    updateById,
    getAdmin,
    updatePassword
}