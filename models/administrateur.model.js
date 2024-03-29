const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const model = mongoose.Schema

const adminSchema = new model({
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        localisation: {
            longitude: {
                type: Number,
                required: false,
                default: null
            },
            latitude: {
                type: Number,
                required: false,
                default: null
            },
            description: {
                type: String,
            },
        },
        password: {
            type: String,
            required: false
        },
        email: {
            type: String,
            require: false,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        status: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        },
        signature: {
            type: String,
            required: false
        },
        profile: {
            type: String,
            required: false,
            default: 'admin'
        },
        profileImage: {
            type: String,
            required: false
        },
        // facture: [{
        //     prixUnitaire: {
        //         type: Number,
        //         required: true
        //     },
        //     montanConsommation: {
        //         type: Number,
        //         required: true
        //     },
        //     fraisEntretien: {
        //         type: Number,
        //         required: true
        //     },
        //     amount: {
        //         type: Number,
        //         required: true
        //     },
        //     amountPayed: {
        //         type: Number,
        //         required: true
        //     },
        //     amountLeft: {
        //         type: Number,
        //         required: true
        //     },
        //     dataLimitePaid: {
        //         type: Date,
        //         required: true
        //     },
        //     facturePay: {
        //         type: Boolean,
        //         required: true
        //     },
        //     factureNotPay: {
        //         type: Boolean,
        //         required: true
        //     },
        //     factureAdvance: {
        //         type: Boolean,
        //         required: true
        //     },
        // }]
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

adminSchema.methods.isPasswordMatch = async function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

adminSchema.pre('save', async function(next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin