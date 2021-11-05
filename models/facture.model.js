const mongoose = require('mongoose')
const model = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

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
        },
        // Prix de la consommation
        montantConsommation: {
            type: Number,
            required: true,
        },
        observation: {
            type: String,
            required: false,
        },
        fraisEntretien: {
            type: Number,
            required: true,
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
        surplus: {
            type: Number,
            required: true,
            default: 0
        },
        preCreate: {
            type: Boolean,
            required: true,
            default: false
        },
        tranche: [{
            montant: Number,
            date: Date
        }],
        dataLimitePaid: {
            type: Date,
            required: true
        },
        facturePay: {
            type: Boolean,
            required: false,
            default: false
        },
        dateReleveNewIndex: {
            type: Date,
            required: true
        },
        dateCreationInvoice: {
            type: Date,
            required: false
        },
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

factureSchema.plugin(mongoosePaginate);

const Facture = mongoose.model('factures', factureSchema)

module.exports = Facture.model('factures', factureSchema)

module.exports = Facture