const validator = require('validator');
const mongoose = require('mongoose')
const model = mongoose.Schema

const userSchema = new model({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        require: true
    },
    birthday: {
        type: String,
        required: true,
        trim: true,
    },
    localisation: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
    },
    email: {
        type: String,
        require: false,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    profile: {
        type: String,
        required: false
    },
    IdCompteur: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    compteur: [{
        oldIndex: {
            type: Number,
            required: true
        },
        newIndex: {
            type: Number,
            required: true
        },
        dateOldIndex: {
            type: Date,
            required: true
        }
    }],
    message: [{
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        dateReception: {
            type: Date,
            required: true
        }
    }],
    facture: [{
        prixUnitaire: {
            type: Number,
            required: true
        },
        montanConsommation: {
            type: Number,
            required: true
        },
        fraisEntretien: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        amountPayed: {
            type: Number,
            required: true
        },
        amountLeft: {
            type: Number,
            required: true
        },
        dataLimitePaid: {
            type: Date,
            required: true
        },
        facturePay: {
            type: Boolean,
            required: true
        },
        factureNotPay: {
            type: Boolean,
            required: true
        },
        factureAdvance: {
            type: Boolean,
            required: true
        },
    }]
})

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});


const users = mongoose.model('user', userSchema)

module.exports = users