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
        dataPaid: Joi.string(),
        montantVerse: Joi.number().required(),
        dateReleveNewIndex: Joi.string().required(),
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
        amount: Joi.number().required()
    }),
}

const getByStatus = {
    params: Joi.object().keys({
        status: Joi.boolean().required(),
    }),
}

const findByYear = {
    params: Joi.object().keys({
        year: Joi.number().required(),
    })
}

const getOneInvoiceByYear = {
    params: Joi.object().keys({
        year: Joi.number().required(),
        idClient: Joi.custom(objectId).required(),
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
    getByStatus,
    findByYear,
    getOneInvoiceByYear
}