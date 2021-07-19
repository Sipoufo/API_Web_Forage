const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const admin = require('../../models/administrateur.model')
const client = require('../../models/client.model')
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
    const email = req.body.email
    const birthday = req.body.birthday
    const password = req.body.password
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = (req.body.longitude) ? req.body.longitude : undefined
    const latitude = (req.body.latitude) ? req.body.longitude : undefined

    console.log(req)
    return client.findOne({ phone })
        .then(client => {
            if (!client) {
                return admin.findOne({ phone })
                    .then(async number => {
                        if (!number) {
                            const result = await admin.create({ name, phone: phone, profileImage, email, birthday, password, localisation: { longitude, latitude, description } })
                            if (result) {
                                res.status(200).json({ status: 200, result: result })
                            } else {
                                res.status(500).json({ status: 500, error: "Error during the save" })
                            }
                        } else {
                            console.log()
                            res.status(500).json({ status: 500, error: "this number exist <-_->" })
                        }
                    })
            } else {
                res.status(500).json({ status: 500, error: "One User have this phone" })
            }
        })
})

const update = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const password = req.body.password
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return client.findOne({ phone })
                .then(client => {
                    if (!client) {
                        return admin.findOne({ phone })
                            .then(async number => {
                                if ((number && number._id === idAdmin) || !number) {
                                    const emailAdmin = await Admin.findOne({ email })
                                    const emailClient = await Client.findOne({ email })
                                    if (!emailAdmin && !emailClient) {
                                        const result = await admin.findByIdAndUpdate(decodedToken.id, { name, phone: phone, profileImage, email, birthday, password, localisation: { longitude, latitude, description } })
                                        if (result) {
                                            res.status(200).json({ status: 200, result: result })
                                        } else {
                                            res.status(500).json({ status: 500, error: "Error during the save" })
                                        }
                                    } else {
                                        res.status(500).json({ status: 500, error: "This email don't exist" })
                                    }
                                } else {
                                    console.log()
                                    res.status(500).json({ status: 500, error: "this number exist <-_->" })
                                }
                            })
                    } else {
                        res.status(500).json({ status: 500, error: "One User have this phone" })
                    }
                })
        }
    })
})

const sendFirstAdmin = catchAsync(async(req, res) => {
    const name = "Sipoufo Yvan"
    const phone = 695914926
    const email = "sipoufoknj@gmail.com"
    const birthday = "1999-12-12"
    const password = "1298ffa93fed18886ef5ddb2837c9c00"
    const longitude = 12
    const latitude = 12

    console.log(req)
    return admin.findOne({ phone })
        .then(async number => {
            if (!number) {
                const result = await admin.create({ name, phone: phone, email, birthday, profile: "superAdmin", password, localisation: { longitude, latitude } })
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

// const login = catchAsync(async(req, res) => {
//     const phone = req.body.phone
//     const password = req.body.password
//     console.log(req)
//     return admin.findOne({ phone })
//         .then(async admin => {
//             if (admin) {
//                 console.log(admin);
//                 const result = await admin.isPasswordMatch(password)
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

const getClients = catchAsync((req, res) => {
    client
        .find()
        .sort({ createdAt: -1 })
        .then(clients => {
            if (clients.length > 0) {
                res.status(200).json({ status: 200, result: clients })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find clients" })
            }
        })
})

const getAdmins = catchAsync((req, res) => {
    admin
        .find()
        .sort({ createdAt: -1 })
        .then(admins => {
            if (admins.length > 0) {
                res.status(200).json({ status: 200, result: admins })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find clients" })
            }
        })
})

module.exports = {
    register,
    sendFirstAdmin,
    logout,
    getClients,
    getAdmins,
    update
}