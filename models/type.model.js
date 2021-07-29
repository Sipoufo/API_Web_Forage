const mongoose = require('mongoose')
const model = mongoose.Schema

const typeSchema = new model({
        name: {
            type: String,
            required: true,
            trim: true,
        },
    }, {
        timestamps: true,
    }

)

const Type = mongoose.model('type', typeSchema)

module.exports = Type