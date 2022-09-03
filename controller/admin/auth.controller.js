const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const admin = require('../../models/administrateur.model')
const client = require('../../models/client.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const { Client } = require('../../models/index');

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
    const email = req.body.email || ''
    const password = req.body.password || 'forage';
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = (req.body.longitude) ? req.body.longitude : undefined
    const latitude = (req.body.latitude) ? req.body.longitude : undefined

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
                res.status(200).json({ status: 200, result: [] })
            }
        })
})

const findClient = catchAsync((req, res) => {
    if (req?.query?.subscriptionDate) {
        let start = new Date(req.query.date);
        let end = new Date(req.query.date);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);

        return Client
        .find({subscriptionDate: {$gte: start, $lt: end}, customerReference: req.query.refId ? req.query.refId : undefined, IdCompteur: req.query.counterId ? req.query.counterId : undefined})
        .sort({ subscriptionDate: (req.query?.order && req.query?.order === 'asc' ? 1 : - 1) })
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
    }

    return Client
    .find({ customerReference: req.query.refId ? req.query.refId : undefined, IdCompteur: req.query.counterId ? req.query.counterId : undefined})
    .sort({ subscriptionDate: (req.query?.order && req.query?.order === 'asc' ? 1 : - 1) })
    .then(clients => {
        if (clients.length > 0) {
            res.status(200).json({ status: 200, result: clients })
        } else {
            res.status(200).json({ status: 200, result: [] })
        }
    })
})

const getClientsWithPagination = catchAsync((req, res) => {
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;
    return Client
        .paginate({}, { page, limit })
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
})

const getClientsBySuscriptionDate = catchAsync((req, res) => {
    const subscriptionDate = (req.params.subscriptionDate) ? req.params.subscriptionDate : '2022-08-30T09:45:38.000+00:00';
    var start = new Date(subscriptionDate);
    var end = new Date(subscriptionDate);

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    return Client.find({subscriptionDate: {$gte: start, $lt: end}})
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
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
    findClient,
    getClients,
    getClientsWithPagination,
    getClientsBySuscriptionDate,
    getAdmins,
    update,
    updateById,
    getOneAdmin,
    getAdminByToken,
    updatePassword,
}