const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const model = mongoose.Schema

const userSchema = new model({
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: false
        },
        phone: {
            type: Number,
            require: true
        },
        localisation: {
            longitude: {
                type: Number,
                required: false
            },
            latitude: {
                type: Number,
                required: false
            },
            description: {
                type: String,
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
            required: false,
            default: 'user'
        },
        profileImage: {
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
        isDelete: {
            type: Boolean,
            default: false
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
        advanceFacture: [{
            idFacture: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "facture",
                required: true,
                trim: true,
            },
            AdvanceCount: {
                type: Number,
                required: true
            },
            advanceDate: {
                type: String,
                required: true
            },
            reset: {
                type: Number,
                required: true
            }
        }],
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }


)

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


const Client = mongoose.model('user', userSchema)

module.exports = Client