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
    }, {
        timestamps: true,
    }


)

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


const Client = mongoose.model('user', userSchema)

module.exports = Client