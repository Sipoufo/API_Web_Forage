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

const updatePassword = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        oldPassword: Joi.custom(password).required(),
        newPassword: Joi.custom(password).required(),
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
        description: Joi.string(),
        profileImage: Joi.string().required(),
    })
}

const updateClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
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

const blockCompteClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        isBlock: Joi.boolean().required(),
    })
}

const IdCompteClient = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        IdCompteur: Joi.string().required(),
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
    blockCompteAdmin,
    IdCompteClient,
    updatePassword
}