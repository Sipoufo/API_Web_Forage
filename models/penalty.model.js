const mongoose = require('mongoose')
const model = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

const penaltySchema = new model({
        dayActivation: {
            type: Number,
            required: true
        },
        pas: {
            type: Number,
            required: true
        },
        percentageAmountAdd: {
            type: Number,
            default: true
        },
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

penaltySchema.plugin(mongoosePaginate);

const Penalty = mongoose.model('penalty', penaltySchema)

module.exports = Penalty