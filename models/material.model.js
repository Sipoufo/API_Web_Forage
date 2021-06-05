const mongoose = require('mongoose')
const model = mongoose.Schema

const materialSchema = new model({
    nom: {
        type: String,
        required: true
    },
    disponible: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

const material = mongoose.model('material', materialSchema)

module.exports = material