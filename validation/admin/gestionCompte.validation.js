const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const deleteCompteClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        isDelete: Joi.boolean().required(),
    })
}

const deleteCompteAdmin = {
    params: Joi.object().keys({
        idAdmin: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        isDelete: Joi.boolean().required(),
    })
}

const updateAdmin = {
    params: Joi.object().keys({
        idAdmin: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        description: Joi.string().required(),
        profileImage: Joi.string().required(),
        birthday: Joi.string().required(),
        password: Joi.custom(password).required(),
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    })
}

const updateClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().required(),
        description: Joi.string().required(),
        profileImage: Joi.string().required(),
        birthday: Joi.string().required(),
        password: Joi.custom(password).required(),
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    })
}

const blockCompteClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        isBlock: Joi.boolean().required(),
    })
}

const blockCompteAdmin = {
    params: Joi.object().keys({
        idAdmin: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        isBlock: Joi.boolean().required(),
    })
}

module.exports = {
    deleteCompteClient,
    deleteCompteAdmin,
    updateAdmin,
    updateClient,
    blockCompteClient,
    blockCompteAdmin
}