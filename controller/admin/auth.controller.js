const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { adminAuth } = require('../../services/index');
const admin = require('../../models/administrateur.model')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'Admin web forage', {
        expiresIn: maxAge
    })
}

const register = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.mail
    const password = req.body.password
    const localisation = req.body.localisation

    return admin.findOne({ phone })
        .then(async number => {
            if (!number) {
                const result = await admin.create({ name, phone: phone, email, password, localisation })
                if (result) {
                    const token = createToken(result._id)
                    res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                    res.status(200).json({ status: 200, result: result })
                } else {
                    res.status(500).json({ status: 500, error: "Error during the save" })
                }
            } else {
                console.log()
                res.status(500).json({ status: 500, error: "this number exist <-_->" })
            }
        })
})

const login = catchAsync(async(req, res) => {
    const number = req.body.number
    const password = req.body.password

    return admin.findOne({ number })
        .then(async admin => {
            if (admin) {
                const result = await admin.isPasswordMatch(password)
                if (result) {
                    const token = createToken(result._id)
                    res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                    res.status(200).json({ status: 200, result: result })
                } else {
                    res.status(500).json({ status: 500, error: "Error during the save" })
                }
            } else {
                res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
            }
        })
})

const logout = (req, res) => {
    res.cookie('pwftoken', '', { maxAge: 1 })
    res.status(200).json({ status: 200, result: "You are log out" })
}

module.exports = {
    register,
    login,
    logout,
}