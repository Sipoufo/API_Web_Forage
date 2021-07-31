const Joi = require('joi')
const { objectId } = require('../custom.validation');

const statusPaidFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        montant: Joi.number().required(),
    })
}

const advanceFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        AdvanceCount: Joi.number().required(),
        advanceDate: Joi.string().required(),
    })
}

const factureWithDate = {
    params: Joi.object().keys({
        status: Joi.boolean().required(),
    })
}

module.exports = {
    statusPaidFacture,
    advanceFacture,
    factureWithDate
}