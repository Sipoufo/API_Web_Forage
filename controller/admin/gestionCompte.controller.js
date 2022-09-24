const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client } = require('../../models/index');
const jwt = require('jsonwebtoken')

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const deleteCompteClient = catchAsync(async(req, res) => {
    const idClient = req.params.idClient
    const isDelete = req.body.isDelete
    await Client.findById(idClient)
        .then(async result => {
            if (result) {
                const clientResult = await Client.findByIdAndUpdate(result._id, { isDelete })
                if (clientResult) {
                    res.status(200).json({ status: 200, result: clientResult });
                } else {
                    res.status(500).json({ status: 500, error: "Error during the update" });
                }
            } else {
                res.status(500).json({ status: 500, error: "I don't see this user" });
            }
        })
})

const deleteCompteAdmin = catchAsync(async(req, res) => {
    const idAdmin = req.params.idAdmin
    const isDelete = req.body.isDelete
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" })
                .then(async result => {
                    if (result) {
                        const adminResult = await Admin.findByIdAndUpdate(idAdmin, { isDelete })
                        if (adminResult) {
                            res.status(200).json({ status: 200, result: adminResult });
                        } else {
                            res.status(500).json({ status: 500, error: "Error during the update" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "Your are not super administrator" });
                    }
                })
        }
    })

})

const updatePassword = catchAsync((req, res) => {
    const id = req.params.id
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    return Admin.findById(id)
        .then(async admin => {
            if (admin) {
                const bcryptPassword = await bcrypt.hash(newPassword, 8)
                const comparePassword = Admin.isPasswordMatch(oldPassword);
                if (comparePassword) {
                    return Admin.findByIdAndUpdate(id, { password: bcryptPassword })
                        .then(resp => {
                            res.status(200).json({ status: 200, result: resp })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    res.status(500).json({ status: 500, error: "Your old password is incorrect" })
                }

            } else {
                return Client.findById(id)
                    .then(async client => {
                        if (client) {
                            const bcryptPassword = await bcrypt.hash(newPassword, 8)
                            const comparePassword = Admin.isPasswordMatch(oldPassword);
                            if (comparePassword) {
                                return Client.findByIdAndUpdate(id, { password: bcryptPassword })
                                    .then(response => {
                                        res.status(200).json({ status: 200, result: response })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            } else {
                                res.status(500).json({ status: 500, error: "Your old password is incorrect" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                        }
                    })
            }
        })
})

const updateAdmin = catchAsync(async(req, res) => {
    const idAdmin = req.params.idAdmin
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    const token = authorization(req)

    console.log(`lng: ${longitude}, lat: ${latitude}`)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" })
                .then(async adminResult => {
                    if (adminResult) {
                        await Client.findOne({ phone })
                            .then(async client => {
                                if (!client) {
                                    await Admin.findOne({ phone })
                                        .then(async number => {
                                            if ((number && number._id == idAdmin) || !number) {
                                                const emailAdmin = await Admin.findOne({ email })
                                                const emailClient = await Client.findOne({ email })
                                                if ((!emailAdmin && !emailClient) || ((emailAdmin && (emailAdmin._id == idAdmin)))) {
                                                    const result = await Admin.findByIdAndUpdate(idAdmin, { name, phone: phone, profileImage, email, localisation: { longitude, latitude, description } })
                                                    if (result) {
                                                        res.status(200).json({ status: 200, result: result })
                                                    } else {
                                                        res.status(500).json({ status: 500, error: "This admin don't exist" })
                                                    }
                                                } else {
                                                    res.status(500).json({ status: 500, error: "This email don't exist" })
                                                }
                                            } else {
                                                res.status(500).json({ status: 500, error: "this number exist <-_->" })
                                            }
                                        })
                                } else {
                                    res.status(500).json({ status: 500, error: "One User have this phone" })
                                }
                            })
                    } else {
                        res.status(500).json({ status: 500, error: "Your are not a super administrator" })
                    }
                })
        }
    })
})

const updateClient = catchAsync(async(req, res) => {
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

const BlockCompteClient = catchAsync(async(req, res) => {
    const isBlock = req.body.isBlock
    const idClient = req.params.idClient
    const token = authorization(req)

    await Client.findById(idClient)
        .then(async client => {
            if (client) {
                if (client.isDelete === false) {
                    const block = await Client.findByIdAndUpdate(idClient, { status: isBlock })
                    if (block) {
                        res.status(200).json({ status: 200, result: block })
                    } else {
                        res.status(500).json({ status: 500, error: "Error during the update" })
                    }
                } else {
                    res.status(500).json({ status: 500, error: "This user is already deleted" })
                }
            } else {
                res.status(500).json({ status: 500, error: "I don't see this user" })
            }
        })
})

const IdCompteClient = catchAsync(async(req, res) => {
    const IdCompteur = req.body.IdCompteur
    const idClient = req.params.idClient

    await Client.findById(idClient)
        .then(async client => {
            if (client) {
                const block = await Client.findByIdAndUpdate(idClient, { IdCompteur })
                if (block) {
                    res.status(200).json({ status: 200, result: block })
                } else {
                    res.status(500).json({ status: 500, error: "Error during the update" })
                }
            } else {
                res.status(500).json({ status: 500, error: "I don't see this user" })
            }
        })
})

const BlockCompteAdmin = catchAsync(async(req, res) => {
    const isBlock = req.body.isBlock
    const idAdmin = req.params.idAdmin
    const token = authorization(req)

    jwt.verify(token, 'Admin web forage', async(err, decodeToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodeToken.id, profile: "superAdmin" })
                .then(async superAdmin => {
                    if (superAdmin) {
                        await Admin.findById(idAdmin)
                            .then(async admin => {
                                if (admin) {
                                    if (admin.isDelete === false) {
                                        const block = await Admin.findByIdAndUpdate(idAdmin, { status: isBlock })
                                        if (block) {
                                            res.status(200).json({ status: 200, result: block })
                                        } else {
                                            res.status(500).json({ status: 500, error: "Error during the update" })
                                        }
                                    } else {
                                        res.status(500).json({ status: 500, error: "This admin is already deleted" })
                                    }

                                } else {
                                    res.status(500).json({ status: 500, error: "I don't see this admin" })
                                }
                            })
                    } else {
                        res.status(500).json({ status: 500, error: "Your are not a super administrator" })
                    }
                })
        }
    })
})

module.exports = {
    deleteCompteClient,
    deleteCompteAdmin,
    updateAdmin,
    updateClient,
    BlockCompteClient,
    BlockCompteAdmin,
    IdCompteClient,
    updatePassword
}