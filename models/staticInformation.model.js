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
        limiteDay: {
            type: Number,
            required: true,
        },
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

const Static = mongoose.model('static', staticSchema)

module.exports = Static