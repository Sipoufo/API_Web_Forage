// const httpStatus = require('http-status');
// const ApiError = require('../../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Admin, Client } = require('../models/index')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'Admin web forage', {
        expiresIn: maxAge
    })
}

const login = catchAsync(async(req, res) => {
    const phone = req.body.phone
    const password = req.body.password

    return Admin.findOne({ phone })
        .then(async admin => {
            if (admin) {
                console.log(admin);
                const result = await admin.isPasswordMatch(password)
                console.log(result);
                if (result) {
                    const token = createToken(result._id)
                    res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                    res.status(200).json({ status: 200, result: admin })
                } else {
                    res.status(500).json({ status: 500, error: "Phone/Password Error" })
                }
            } else {
                // res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                return Client.findOne({ phone })
                    .then(async(client) => {
                        if (client) {
                            console.log(client);
                            const result = await client.isPasswordMatch(password)
                            console.log(result);
                            if (result) {
                                const token = createToken(result._id)
                                res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                                res.status(200).json({ status: 200, result: client })
                            } else {
                                res.status(500).json({ status: 500, error: "Phone/Password Error" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

const localisation = catchAsync(async(req, res) => {
    const id = req.params.id
    const longitude = req.body.longitude
    const latitude = req.body.latitude

    return Admin.findById(id)
        .then(admin => {
            if (admin) {
                return Admin.findByIdAndUpdate(id, { localisation: { longitude, latitude } })
                    .then(res => {
                        res.status(200).json({ status: 200, result: res })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                return Client.findById(id)
                    .then(client => {
                        if (client) {
                            return Client.findByIdAndUpdate(id, { localisation: { longitude, latitude } })
                                .then(response => {
                                    res.status(200).json({ status: 200, result: response })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        } else {
                            res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                        }
                    })
            }
        })
})

module.exports = {
    login,
    localisation
}