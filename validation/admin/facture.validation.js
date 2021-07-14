const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const addFacture = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        oldIndex: Joi.number().required(),
        consommation: Joi.number().required(),
        prixUnitaire: Joi.number(),
        montantConsommation: Joi.number().required(),
        fraisEntretien: Joi.number(),
        montantTotal: Joi.number().required(),
        dataLimitePaid: Joi.date().required(),
        dateReleveOldIndex: Joi.date().required(),
    })
}

const updateFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        oldIndex: Joi.number().required(),
        consommation: Joi.number().required(),
        prixUnitaire: Joi.number(),
        montantConsommation: Joi.number().required(),
        fraisEntretien: Joi.number(),
        montantTotal: Joi.number().required(),
        dataLimitePaid: Joi.date().required(),
        dateReleveOldIndex: Joi.date().required(),
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

const getClientFactures = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
}

module.exports = {
    addFacture,
    updateFacture,
    getClientFactures,
    statusPaidFacture
}