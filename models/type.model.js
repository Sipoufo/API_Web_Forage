const mongoose = require('mongoose')
const model = mongoose.Schema

const typeSchema = new model({
        name: {
            type: String,
            required: true,
            trim: true,
        },
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

const Type = mongoose.model('type', typeSchema)

module.exports = Type