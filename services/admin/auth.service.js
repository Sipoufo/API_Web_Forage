const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const admin = require('../../models/administrateur.model')

const register = async(body) => {
    const name = body.name
    const phone = body.phone
    const email = body.mail
    const password = body.password
    const localisation = body.localisation

    return admin.findOne({ phone })
        .then(async number => {
            if (!number) {
                const result = await admin.create({ name, phone: phone, email, password, localisation })
                if (result) {
                    return result
                } else {
                    throw new ApiError(httpStatus.BAD_REQUEST, result)
                }
            } else {
                console.log()
                throw new ApiError(httpStatus.BAD_REQUEST, 'this number exist <-_->')
            }
        })
}

const login = async(body) => {
    const number = body.number
    const password = body.password

    return admin.findOne({ number })
        .then(async admin => {
            if (admin) {
                const result = await admin.isPasswordMatch(password)
                if (result) return result
                else throw new ApiError(httpStatus.BAD_REQUEST, 'Error to password')
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'I don\'t know this password')
            }
        })
}

module.exports = {
    register,
    login,
}