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
    const description = (req.body.description) ? req.body.description : null
    const subscriptionDate = req.body.subscriptionDate;
    const subscriptionAmount = req.body.subscriptionAmount;
    const customerReference = req.body.customerReference;
    const observation = req.body.observation;
    const profileImage = req.body.profileImage
    const idCompteur = req.body.idCompteur;
    const password = req.body.password;
    const longitude = (req.body.longitude) ? req.body.longitude : null
    const latitude = (req.body.latitude) ? req.body.longitude : null

    return Admin.findOne({ phone })
        .then(admin => {
            if (!admin) {
                return Client.findOne({ phone })
                    .then(async number => {
                        if (!number) {
                            const client = {
                                name,
                                password,
                                phone,
                                description,
                                subscriptionDate,
                                subscriptionAmount,
                                customerReference,
                                observation,
                                localisation: { longitude, latitude, description },
                                profileImage,
                                idCompteur,
                            }

                            const result = await Client.create(client)
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
                res.status(500).json({ status: 500, error: "This phone existe" })
            }
        })

})

const update = catchAsync(async(req, res) => {
    const token = authorization(req)

    const name = req.body.name
    const phone = req.body.phone
    const description = (req.body.description) ? req.body.description : null
    const subscriptionDate = req.body.subscriptionDate;
    const subscriptionAmount = req.body.subscriptionAmount;
    const customerReference = req.body.customerReference;
    const observation = req.body.observation;
    const profileImage = req.body.profileImage
    const idCompteur = req.body.idCompteur;
    const password = req.body.password;
    const longitude = (req.body.longitude) ? req.body.longitude : null
    const latitude = (req.body.latitude) ? req.body.longitude : null

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return Admin.findOne({ phone })
                .then(async admin => {
                    if (!admin) {
                        const user = await Client.findOne({ phone });
                        if ((user && user._id == decodedToken.id) || !user) {
                            const client = {
                                name,
                                password,
                                phone,
                                description,
                                subscriptionDate,
                                subscriptionAmount,
                                customerReference,
                                observation,
                                localisation: { longitude, latitude, description },
                                profileImage,
                                idCompteur,
                            }
                            const result = await Client.findByIdAndUpdate(decodedToken.id, checkField(user, client));
                                if (result) {
                                    res.status(200).json({ status: 200, result: result });
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the save" });
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

const checkField = (clientOnBD, newInfoUser) => {
    const client = {
        name: (newInfoUser?.name) ? (newInfoUser?.name): clientOnBD?.name,
        password: (newInfoUser?.password) ? (newInfoUser?.password): clientOnBD?.password,
        phone: (newInfoUser?.phone) ? (newInfoUser?.phone): clientOnBD?.phone,
        description: (newInfoUser?.description) ? (newInfoUser?.description): clientOnBD?.description,
        subscriptionDate: (newInfoUser?.subscriptionDate) ? (newInfoUser?.subscriptionDate): clientOnBD?.subscriptionDate,
        subscriptionAmount: (newInfoUser?.subscriptionAmount) ? (newInfoUser?.subscriptionAmount): clientOnBD?.subscriptionAmount,
        customerReference: (newInfoUser?.customerReference) ? (newInfoUser?.customerReference): clientOnBD?.customerReference,
        observation: (newInfoUser?.observation) ? (newInfoUser?.observation): clientOnBD?.observation,
        profileImage: (newInfoUser?.profileImage) ? (newInfoUser?.profileImage): clientOnBD?.profileImage,
        idCompteur: (newInfoUser?.idCompteur) ? (newInfoUser?.idCompteur): clientOnBD?.idCompteur,
        localisation: { 
            longitude: (newInfoUser?.longitude) ? (newInfoUser?.longitude): clientOnBD?.longitude,
             latitude:(newInfoUser?.latitude) ? (newInfoUser?.latitude): clientOnBD?.latitude,
             description: (newInfoUser?.description) ? (newInfoUser?.description): clientOnBD?.description},
        }
    return client;
}

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
                            res.status(500).json({ status: 500, error: "Your old password is incorrect" });
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
    const description = (req.body.description) ? req.body.description : null
    const subscriptionDate = req.body.subscriptionDate;
    const subscriptionAmount = req.body.subscriptionAmount;
    const customerReference = req.body.customerReference;
    const observation = req.body.observation;
    const profileImage = req.body.profileImage
    const idCompteur = req.body.idCompteur;
    const password = req.body.password;
    const longitude = (req.body.longitude) ? req.body.longitude : null
    const latitude = (req.body.latitude) ? req.body.longitude : null

    return Admin.findOne({ phone })
        .then(async admin => {
            if (!admin) {
                const user = await Client.findOne({ phone });
                if ((user && user._id == idClient) || !user) {
                    const client = {
                        name,
                        password,
                        phone,
                        description,
                        subscriptionDate,
                        subscriptionAmount,
                        customerReference,
                        observation,
                        localisation: { longitude, latitude, description },
                        profileImage,
                        idCompteur,
                    }
                    const result = await Client.findByIdAndUpdate(idClient, checkField(user, client));
                        if (result) {
                            res.status(200).json({ status: 200, result: result });
                        } else {
                            res.status(500).json({ status: 500, error: "Error during the save" });
                        }
                } else {
                    console.log();
                    res.status(500).json({ status: 500, error: "this number exist <-_->" });
                }
            } else {
                res.status(500).json({ status: 500, error: "One Admin have this phone" })
            }
        })
})

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

const countClient = catchAsync((req, res) => {
    const token = authorization(req)
    console.log('count count');

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return Client
                .find({})
                .then(response => {
                    if (response) {
                        res.status(200).json({ status: 200, result: response.length });
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

module.exports = {
    register,
    logout,
    update,
    updateById,
    countClient,
    getOneClient,
    getClientByToken,
    dashboard,
    updatePassword
}