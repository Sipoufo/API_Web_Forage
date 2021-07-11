const Joi = require('joi')
const { objectId } = require('../custom.validation');

const statusPaidFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        status: Joi.number().required(),
    })
}

module.exports = {
    statusPaidFacture
}