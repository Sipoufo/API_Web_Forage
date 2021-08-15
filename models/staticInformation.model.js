const mongoose = require('mongoose')
const model = mongoose.Schema

const staticSchema = new model({
        prixUnitaire: {
            type: Number,
            required: true,
        },
        fraisEntretien: {
            type: Number,
            required: true,
        },
        idAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin",
            required: true,
            trim: true,
        },
    }, {
        timestamps: true,
    }

)

const Static = mongoose.model('static', staticSchema)

module.exports = Static