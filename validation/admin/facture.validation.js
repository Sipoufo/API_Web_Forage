const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const addFacture = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        oldIndex: Joi.number(),
        observation: Joi.string().required(),
        penalite: Joi.number(),
        dataPaid: Joi.date(),
        montantVerse: Joi.number().required(),
        dateReleveNewIndex: Joi.date().required(),
    })
}

const updateFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        observation: Joi.string().required(),
        penalite: Joi.number(),
        montantVerse: Joi.number().required(),
        dateReleveNewIndex: Joi.date().required(),
    })
}

const statusPaidFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.boolean().required(),
    })
}

const getByStatus = {
    body: Joi.object().keys({
        status: Joi.boolean().required(),
    })
}

const getClientFactures = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
}

module.exports = {
    addFacture,
    updateFacture,
    getClientFactures,
    statusPaidFacture,
    getByStatus
}