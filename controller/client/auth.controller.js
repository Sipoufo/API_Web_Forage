const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Client = require('../../models/client.model')
const Admin = require('../../models/administrateur.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Facture } = require('../../models');

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const register = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const description = (req.body.description) ? req.body.description : null
    const IdCompteur = req.body.IdCompteur
    const password = req.body.password
    const profileImage = req.body.profileImage
    const longitude = (req.body.longitude) ? req.body.longitude : undefined
    const latitude = (req.body.latitude) ? req.body.longitude : undefined


    return Admin.findOne({ phone })
        .then(admin => {
            if (!admin) {
                return Client.findOne({ phone })
                    .then(number => {
                        if (!number) {
                            return Client.findOne({ email })
                                .then(async(mail) => {
                                    if (!mail) {
                                        const result = await Client.create({ name, phone, IdCompteur, profileImage, email, birthday, password, localisation: { longitude, latitude, description } })
                                        if (result) {
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
            } else {
                res.status(500).json({ status: 500, error: "This phone existe" })
            }
        })

})

const update = catchAsync(async(req, res) => {
    const token = authorization(req)
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const profileImage = req.body.profileImage
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return Admin.findOne({ phone })
                .then(async admin => {
                    if (!admin) {
                        const number = await Client.findOne({ phone });
                        if ((number && number._id == decodedToken.id) || !number) {
                            const emailAdmin = await Admin.findOne({ email });
                            const emailClient = await Client.findOne({ email });
                            console.log(emailAdmin);
                            if ((!emailAdmin && !emailClient) || ((emailClient && (emailClient._id == decodedToken.id)))) {
                                const result = await Client.findByIdAndUpdate(decodedToken.id, { name, phone: phone, profileImage, email, birthday });
                                if (result) {
                                    res.status(200).json({ status: 200, result: result });
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the save" });
                                }
                            } else {
                                res.status(500).json({ status: 500, error: "This email exist" });
                            }

                        } else {
                            console.log();
                            res.status(500).json({ status: 500, error: "this number exist <-_->" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "One Admin have this phone" })
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
            await Client
                .findById(decodedToken.id)
                .then(async client => {
                    if (client) {
                        const bcryptPassword = await bcrypt.hash(newPassword, 8);
                        const comparePassword = await client.isPasswordMatch(oldPassword);
                        if (comparePassword) {
                            const update = await Client.findByIdAndUpdate(decodedToken.id, { password: bcryptPassword })
                            if (update) {
                                const find = await Client.findById(decodedToken.id)
                                res.status(200).json({ status: 200, result: find });
                            } else {
                                res.status(500).json({ status: 500, error: "Error while the update password" });
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "Your old password is needed" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "this customer don't exist" });
                    }
                })
        }
    })
})

const updateById = catchAsync(async(req, res) => {
    const idClient = req.params.idClient
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const IdCompteur = req.body.IdCompteur
    const profileImage = req.body.profileImage
    return Admin.findOne({ phone })
        .then(async admin => {
            if (!admin) {
                const number = await Client.findOne({ phone });
                if ((number && number._id == idClient) || !number) {
                    const emailAdmin = await Admin.findOne({ email });
                    const emailClient = await Client.findOne({ email });
                    if (!emailAdmin && !emailClient) {
                        const result = await Client.findByIdAndUpdate(idClient, { name, IdCompteur, phone: phone, profileImage, email, birthday });
                        if (result) {
                            res.status(200).json({ status: 200, result: result });
                        } else {
                            res.status(500).json({ status: 500, error: "Error during the save" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "This email don't exist" });
                    }

                } else {
                    console.log();
                    res.status(500).json({ status: 500, error: "this number exist <-_->" });
                }
            } else {
                res.status(500).json({ status: 500, error: "One Client have this phone" })
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

const getOneClient = catchAsync(async(req, res) => {
    const id = req.params.idClient
    return Client
        .findById(id)
        .then(response => {
            console.log(id);
            if (response) {
                res.status(200).json({ status: 200, result: response });
            } else {
                res.status(500).json({ status: 500, error: "This client don't exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
})

const getClientByToken = catchAsync((req, res) => {
    const token = authorization(req)

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            console.log(decodedToken.id);
            return Client
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


});

const dashboard = catchAsync(async(req, res) => {
    // console.log(await bcrypt.hash("Azerty12", 8));
    const token = authorization(req);
    let numberFacturePaid = 0;
    let numberFactureInvoice = 0;
    let numberFacture = 0;
    let client = null;
    let facturePaid = [];
    let factureInvoice = [];
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Facture
                .find({ idClient: decodedToken.id })
                .then(async facture => {
                    if (facture.length > 0) {
                        facturePaid = await Facture.find({ facturePay: true, idClient: decodedToken.id });
                        factureInvoice = await Facture.find({ facturePay: false, idClient: decodedToken.id });
                        numberFacturePaid = await Facture.find({ facturePay: true, idClient: decodedToken.id }).count();
                        numberFactureInvoice = await Facture.find({ facturePay: false, idClient: decodedToken.id }).count();
                        numberFacture = await Facture.find({ idClient: decodedToken.id }).count();
                    }
                })
            client = await Client.findById(decodedToken.id);
            res.status(200).json({ status: 200, result: { client, facturePaid, factureInvoice, numberFacturePaid, numberFactureInvoice, numberFacture } })
        }
    })
})

module.exports = {
    register,
    logout,
    update,
    updateById,
    getOneClient,
    getClientByToken,
    dashboard,
    updatePassword
}