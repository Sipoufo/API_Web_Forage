const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const admin = require('../../models/administrateur.model')
const client = require('../../models/client.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'Admin web forage', {
        expiresIn: maxAge
    })
}

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}


const register = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const password = req.body.password
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = (req.body.longitude) ? req.body.longitude : undefined
    const latitude = (req.body.latitude) ? req.body.longitude : undefined

    console.log(password)
    return client.findOne({ phone })
        .then(client => {
            if (!client) {
                return admin.findOne({ phone })
                    .then(async number => {
                        if (!number) {
                            const result = await admin.create({ name, phone: phone, profileImage, email, password, localisation: { longitude, latitude, description } })
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
    const token = authorization(req)
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return client.findOne({ phone })
                .then(clien => {
                    if (!clien) {
                        return admin.findOne({ phone })
                            .then(async number => {
                                if ((number && number._id == decodedToken.id) || !number) {
                                    const emailAdmin = await admin.findOne({ email })
                                    const emailClient = await client.findOne({ email })
                                    if ((!emailAdmin && !emailClient) || ((emailAdmin && (emailAdmin._id == decodedToken.id)))) {
                                        const result = await admin.findByIdAndUpdate(decodedToken.id, { name, phone: phone, profileImage, email, localisation: { longitude, latitude, description } })
                                        if (result) {
                                            res.status(200).json({ status: 200, result: result })
                                        } else {
                                            res.status(500).json({ status: 500, error: "Error during the save" })
                                        }
                                    } else {
                                        res.status(500).json({ status: 500, error: "This email exist" })
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

const updatePassword = catchAsync((req, res) => {
    const token = authorization(req)
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await admin
                .findById(decodedToken.id)
                .then(async ad => {
                    if (ad) {
                        const bcryptPassword = await bcrypt.hash(newPassword, 8);
                        const comparePassword = await ad.isPasswordMatch(oldPassword);
                        if (comparePassword) {
                            const update = await admin.findByIdAndUpdate(decodedToken.id, { password: bcryptPassword })
                            if (update) {
                                const find = await admin.findById(decodedToken.id)
                                res.status(200).json({ status: 200, result: find });
                            } else {
                                res.status(500).json({ status: 500, error: "Error while the update password" });
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "Your old password is incorrect" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "This customer don't exist" });
                    }
                })
        }
    })
})

const updateById = catchAsync(async(req, res) => {
    const idAdmin = req.params.idAdmin
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude

    return client.findOne({ phone })
        .then(userClient => {
            if (!userClient) {
                return admin.findOne({ phone })
                    .then(async number => {
                        console.log(number._id == idAdmin);
                        if ((number && number._id == idAdmin) || !number) {
                            const emailAdmin = await admin.findOne({ email })
                            const emailClient = await client.findOne({ email })
                            if (!emailAdmin && !emailClient) {
                                const result = await admin.findByIdAndUpdate(idAdmin, { name, phone: phone, profileImage, email, localisation: { longitude, latitude, description } })
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
})

const sendFirstAdmin = catchAsync(async(req, res) => {
    const name = "Sipoufo Yvan"
    const phone = 695914926
    const email = "sipoufoknj@gmail.com"
    const password = "ef773dcfc029bb1c25e48dbbe188372b"
    const longitude = 12
    const latitude = 12
    const profileImage = "noPath"

    console.log(req)
    return admin.findOne({ phone })
        .then(async number => {
            if (!number) {
                const result = await admin.create({ name, phone: phone, email, profile: "superAdmin", password, localisation: { longitude, latitude } })
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

const getOneAdmin = catchAsync(async(req, res) => {
    const id = req.params.idAdmin
    return admin
        .findById(id)
        .then(response => {
            if (response) {
                res.status(200).json({ status: 200, result: response });
            } else {
                res.status(500).json({ status: 500, error: "This admin don't exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
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
        .sort({ name: 0 })
        .then(clients => {
            if (clients.length > 0) {
                res.status(200).json({ status: 200, result: clients })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find clients" })
            }
        })
})

const getAdmins = catchAsync((req, res) => {
    const token = authorization(req)
    let allAdmin = []
    admin
        .find()
        .sort({ name: 0 })
        .then(admins => {
            jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
                if (err) {
                    console.log(err);
                } else {
                    if (admins.length > 0) {
                        for (let i = 0; i < admins.length; i++) {
                            console.log(admins[i]._id != decodedToken.id);
                            if (admins[i]._id != decodedToken.id) {
                                allAdmin.push(admins[i])
                            }

                        }
                        res.status(200).json({ status: 200, result: allAdmin })
                    } else {
                        res.status(500).json({ status: 500, error: "Error while the find clients" })
                    }
                }
            })

        })
})

const getAdminByToken = catchAsync((req, res) => {
    const token = authorization(req)

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return admin
                .findById(decodedToken.id)
                .then(response => {
                    if (response) {
                        res.status(200).json({ status: 200, result: response });
                    } else {
                        res.status(500).json({ status: 500, error: "This admin don't exist" })
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ status: 500, error: "Error" })
                })
        }
    })


})

module.exports = {
    register,
    sendFirstAdmin,
    logout,
    getClients,
    getAdmins,
    update,
    updateById,
    getOneAdmin,
    getAdminByToken,
    updatePassword
}