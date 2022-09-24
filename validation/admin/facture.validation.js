const Joi = require('joi')
const { password, objectId } = require('../custom.validation');

const addFacture = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        oldIndex: Joi.number(),
        idCompteur: Joi.string().required(),
        dateReleveNewIndex: Joi.string().required(),
    })
};

const preCreate = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        IdCompteur: Joi.string().required(),
        newIndex: Joi.number().required(),
        oldIndex: Joi.number(),
    })
};

const removePenalty = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
};

const addInformation = {
    body: Joi.object().keys({
        prixUnitaire: Joi.number().required(),
        fraisEntretien: Joi.number().required(),
        limiteDay: Joi.number().required(),
    })
};

const addPenalty = {
    body: Joi.object().keys({
        pas: Joi.number().required(),
        amountAdd: Joi.number().required(),
    })
};

const haveInvoice = {
    params: Joi.object().keys({
        idClient: Joi.custom(objectId).required(),
    })
};

const updateFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        newIndex: Joi.number().required(),
        observation: Joi.string(),
        penalite: Joi.number(),
        montantVerse: Joi.number().required(),
        dateReleveNewIndex: Joi.date().required(),
    })
}

const deleteFacture = {
    params: Joi.object().keys({
        idFacture: Joi.custom(objectId).required()
    }),
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

const getFactures = {
    params: Joi.object().keys({
        year: Joi.number(),
        month: Joi.number(),
        limit: Joi.number(),
        page: Joi.number(),
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

const seeUnpaidInvoicewithDate = {
    params: Joi.object().keys({
        dateUnpaid: Joi.date().required(),
    })
}

const getUserThatHaveNotPaidInvoiceWithDate = {
    params: Joi.object().keys({
        date: Joi.date().required(),
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
    getOneInvoiceByYear,
    getFactures,
    addInformation,
    seeUnpaidInvoicewithDate,
    haveInvoice,
    addPenalty,
    preCreate,
    removePenalty,

    getUserThatHaveNotPaidInvoiceWithDate
}