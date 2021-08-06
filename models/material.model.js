const mongoose = require('mongoose')
const model = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

const materialSchema = new model({
        name: {
            type: String,
            required: true
        },
        disponible: {
            type: Boolean,
            required: false,
            default: true
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "type",
            required: true,
            trim: true,
        },
        prixUnit: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        picture: {
            type: String,
            required: false
        },
        input: [{
            quantity: Number,
            prixUnit: Number,
            date: Date,
        }],
        output: [{
            quantity: Number,
            prixUnit: Number,
            date: Date,
        }],
    }, {
        timestamps: true,
    }

)

materialSchema.plugin(mongoosePaginate);

const material = mongoose.model('material', materialSchema)

module.exports = material