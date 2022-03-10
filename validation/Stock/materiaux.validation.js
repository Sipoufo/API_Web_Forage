const Joi = require('joi');
const { password, objectId } = require('../custom.validation');

const addMateriaux = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.custom(objectId).required(),
        prixUnit: Joi.number().required(),
        quantity: Joi.number().required(),
        description: Joi.string(),
        picture: Joi.string().required(),
    })
};

const addType = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    })
};

const updateMaterial = {
    params: Joi.object().keys({
        id: Joi.custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.custom(objectId).required(),
        prixUnit: Joi.number().required(),
        quantity: Joi.number().required(),
        description: Joi.string(),
        picture: Joi.string().required(),
    })
};

const deleteType = {
    params: Joi.object().keys({
        idType: Joi.custom(objectId).required(),
    }),
};

const getMateriauxInputByYear = {
    params: Joi.object().keys({
        year: Joi.number().required(),
    }),
};

const getAllMateriaux = {
    body: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number()
    })
};

const getOneMateriaux = {
    body: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number()
    })
};

const getGetByType = {
    body: Joi.object().keys({
        type: Joi.string().required(),
        page: Joi.number(),
        limit: Joi.number()
    })
};

const removeMaterial = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        quantity: Joi.number(),
    })
};

const getGetByPrise = {
    body: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number()
    })
};

module.exports = {
    addMateriaux,
    getAllMateriaux,
    updateMaterial,
    getOneMateriaux,
    getGetByType,
    getGetByPrise,
    addType,
    deleteType,
    removeMaterial,
    getMateriauxInputByYear
}