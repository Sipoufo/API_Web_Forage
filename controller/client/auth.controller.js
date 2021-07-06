const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Client = require('../../models/client.model')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'client web forage', {
        expiresIn: maxAge
    })
}

const register = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const password = req.body.password
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    console.log(email);
    return Client.findOne({ phone })
        .then(number => {
            if (!number) {
                return Client.findOne({ email })
                    .then(async(mail) => {
                        if (!mail) {
                            const result = await Client.create({ name, phone, email, birthday, password, localisation: { longitude, latitude } })
                            if (result) {
                                const token = createToken(result._id)
                                res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                                res.status(200).json({ status: 200, result: result })
                            } else {
                                res.status(500).json({ status: 500, error: "Error during the save" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "this email exist <-_->" })
                        }

                    })
            } else {
                console.log()
                res.status(500).json({ status: 500, error: "this number exist <-_->" })
            }
        })
})

// const login = catchAsync(async(req, res) => {
//     const phone = req.query.phone
//     const password = req.query.password
//     console.log(req)
//     return Client.findOne({ phone })
//         .then(async admin => {
//             if (admin) {
//                 console.log(admin);
//                 const result = await Client.isPasswordMatch(password)
//                 console.log(result);
//                 if (result) {
//                     const token = createToken(result._id)
//                     res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
//                     res.status(200).json({ status: 200, result: admin })
//                 } else {
//                     res.status(500).json({ status: 500, error: "Phone/Password Error" })
//                 }
//             } else {
//                 res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
//             }
//         })
// })

const logout = (req, res) => {
    res.cookie('pwftoken', '', { maxAge: 1 })
    res.status(200).json({ status: 200, result: "You are log out" })
}

module.exports = {
    register,
    logout,
}