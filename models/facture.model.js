const mongoose = require('mongoose')
const model = mongoose.Schema

const factureSchema = new model({
        idClient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            trim: true,
        },
        idAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin",
            required: true,
            trim: true,
        },
        newIndex: {
            type: Number,
            required: true
        },
        oldIndex: {
            type: Number,
            required: true
        },
        // la consommation en M3
        consommation: {
            type: Number,
            required: true
        },
        // Prix du M3
        prixUnitaire: {
            type: Number,
            required: true,
            default: 500
        },
        // Prix de la consommation
        montantConsommation: {
            type: Number,
            required: true,
        },
        observation: {
            type: String,
            required: true,
        },
        fraisEntretien: {
            type: Number,
            required: false,
            default: 1000
        },
        penalite: {
            type: Number,
            required: true
        },
        montantImpaye: {
            type: Number,
            required: false,
            default: 0
        },
        montantVerse: {
            type: Number,
            required: false,
            default: 0
        },
        dataLimitePaid: {
            type: Date,
            required: true
        },
        facturePay: {
            type: Boolean,
            required: false,
            default: false
        },
        dateFacturation: {
            type: Date,
            required: false,
            default: false
        },
        datePaid: {
            type: Date,
            required: true,
            default: false
        },
        dateReleveNewIndex: {
            type: Date,
            required: true
        },
    }, {
        timestamps: true,
    }

)

const Facture = mongoose.model('factures', factureSchema)

module.exports = Facture.model('factures', factureSchema)

module.exports = Facture