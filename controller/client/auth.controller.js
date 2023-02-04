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

const register = catchAsync(async (req, res) => {
    const name = req.body.name
    let phone = req.body.phone
    const description = (req.body.description) ? req.body.description : null
    const subscriptionDate = req.body.subscriptionDate;
    const subscriptionAmount = req.body.subscriptionAmount;
    const customerReference = req.body.customerReference;
    const observation = req.body.observation;
    const profileImage = req.body.profileImage
    const idCompteur = req.body.idCompteur;
    const password = req.body.password;
    const hasPhoneNumber = true;
    let error = '';

    try {
        if (phone.length == 0) {
            let phones = [];
            hasPhoneNumber = false;
            const clients = await Client.find({ hasPhoneNumber });

            for (let index = 0; index < clients.length; index++) {
                phones.push(clients[index].phone[0]);
            }

            phones = phones.sort((a, b) => a - b);
            let tel = phones.length > 0 ? phones[phones.length] + 1 : 1;
            phone = [tel];
        }

        for (let index = 0; index < phone.length; index++) {
            const element = phone[index];
            if (error === '') {
                const admins = await Admin.find({ phone: element });
                console.log(admins);
                if (admins.length <= 0) {
                    let client = await Client.find({ phone: element });
                    if (client.length > 0) {
                        error = "User with this phone exist";
                    }
                } else {
                    error = "Admin with this phone exist";
                }
            }
        }

        const size = await Client.find({}).count();

        if (error === '') {
            let client = {
                customerReference: (size + 1),
                hasPhoneNumber
            };

            if (name && name !== '') {
                let data = {
                    ...client,
                    name
                }
                client = data;
            }

            if (password && password !== 'not') {
                let data = {
                    ...client,
                    password
                }
                client = data;
            }

            if (phone) {
                let data = {
                    ...client,
                    phone
                }
                client = data;
            }

            if (description) {
                let data = {
                    ...client,
                    description
                }
                client = data;
            }

            if (subscriptionDate && subscriptionDate !== 'not') {
                const [year, month, day] = subscriptionDate.split('-')
                const date = new Date(year, month - 1, day);

                if (date > new Date()) {
                    res.status(500).json({ status: 500, error: "date of subscription cannot be greater than date of today" })
                    return;
                }

                let data = {
                    ...client,
                    subscriptionDate
                }
                client = data;
            }

            if (subscriptionAmount && subscriptionAmount !== 0) {
                let data = {
                    ...client,
                    subscriptionAmount
                }
                client = data;
            }

            if (observation && observation !== 'not') {
                let data = {
                    ...client,
                    observation
                }
                client = data;
            }

            if (profileImage && profileImage !== '') {
                let data = {
                    ...client,
                    profileImage
                }
                client = data;
            }

            if (idCompteur) {
                let data = {
                    ...client,
                    idCompteur
                }
                client = data;
            }

            const result = await Client.create(client)
            if (result) {
                res.status(200).json({ status: 200, result: result })
            } else {
                res.status(500).json({ status: 500, error: "Error during the save" })
            }
        } else {
            res.status(500).json({ status: 500, error });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
})

const update = catchAsync(async (req, res) => {
    const token = authorization(req)
    let error = '';

    const name = req.body.name
    const phone = req.body.phone
    const description = (req.body.description) ? req.body.description : null
    const subscriptionDate = req.body.subscriptionDate;
    const subscriptionAmount = req.body.subscriptionAmount;
    const customerReference = req.body.customerReference;
    const observation = req.body.observation;
    const profileImage = req.body.profileImage
    const idCompteur = req.body.idCompteur;

    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
        if (err) {
            console.log('token error :', err);
            res.status(500).json({ status: 500, error: err.message });
        } else {
            try {
                if (phone?.length > 0) {
                    for (let index = 0; index < phone?.length; index++) {
                        const element = phone[index];
                        if (error === '') {
                            const admins = await Admin.find({ phone: element });
                            if (admins.length <= 0) {
                                let clients = await Client.find({ phone: element });
                                if (clients.length > 0) {
                                    let client = clients[0];
                                    if ((client && client._id !== decodedToken.id)) {
                                        error = "User with this phone exist";
                                    }
                                }
                            } else {
                                error = "One Admin have this phone";
                            }
                        }
                    }
                }

                if (error === '') {
                    return Client.findOne({ customerReference }).then(async user => {
                        if (user && user._id + "" === decodedToken.id) {
                            let client = {};

                            if (name && name !== '') {
                                client = {
                                    name
                                }
                            }

                            if (phone && phone?.length > 0) {
                                client = {
                                    ...client,
                                    phone
                                }
                            }

                            if (description) {
                                client = {
                                    ...client,
                                    description
                                }
                            }

                            if (subscriptionDate && subscriptionDate !== 'not') {
                                const [year, month, day] = subscriptionDate.split('-')
                                const date = new Date(year, month - 1, day);
                                if (date > new Date()) {
                                    res.status(500).json({ status: 500, error: "date of subscription cannot be greater than date of today" })
                                    return;
                                }

                                client = {
                                    ...client,
                                    subscriptionDate
                                }
                            }

                            if (subscriptionAmount && subscriptionAmount !== 0) {
                                client = {
                                    ...client,
                                    subscriptionAmount
                                }
                            }

                            if (customerReference && customerReference !== 0) {
                                client = {
                                    ...client,
                                    customerReference
                                }
                            }

                            if (observation && observation !== 'not') {
                                client = {
                                    ...client,
                                    observation
                                }
                            }

                            if (profileImage && profileImage !== '') {
                                client = {
                                    ...client,
                                    profileImage
                                }
                            }

                            if (idCompteur) {
                                client = {
                                    ...client,
                                    idCompteur
                                }
                            }
                            console.log("client: ", client);

                            const idUser = mongoose.Types.ObjectId("" + decodedToken.id);
                            const result = await Client.findByIdAndUpdate({ _id: idUser }, checkField(user, client));
                            if (result) {
                                res.status(200).json({ status: 200, result: result })
                            } else {
                                res.status(500).json({ status: 500, error: "Error during the update" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "user with this id reference exist <-_->" })
                        }
                    });
                } else {
                    res.status(500).json({ status: 500, error });
                }
            } catch (error) {
                res.status(500).json({ status: 500, error });
            }
        }
    })
})

const checkField = (clientOnBD, newInfoUser) => {
    const client = {
        name: (newInfoUser?.name && newInfoUser?.name !== '') ? (newInfoUser?.name) : clientOnBD?.name,
        password: (newInfoUser?.password && newInfoUser?.password !== 'not') ? (newInfoUser?.password) : clientOnBD?.password,
        phone: (newInfoUser?.phone) ? (newInfoUser?.phone) : clientOnBD?.phone,
        description: (newInfoUser?.description) ? (newInfoUser?.description) : clientOnBD?.description,
        subscriptionDate: (newInfoUser?.subscriptionDate && newInfoUser?.subscriptionDate !== 'not') ? (newInfoUser?.subscriptionDate) : clientOnBD?.subscriptionDate,
        subscriptionAmount: (newInfoUser?.subscriptionAmount && newInfoUser?.subscriptionAmount !== 0) ? (newInfoUser?.subscriptionAmount) : clientOnBD?.subscriptionAmount,
        customerReference: (newInfoUser?.customerReference && newInfoUser?.customerReference !== 0) ? (newInfoUser?.customerReference) : clientOnBD?.customerReference,
        observation: (newInfoUser?.observation && newInfoUser?.observation !== 'not') ? (newInfoUser?.observation) : clientOnBD?.observation,
        profileImage: (newInfoUser?.profileImage && newInfoUser?.profileImage !== '') ? (newInfoUser?.profileImage) : clientOnBD?.profileImage,
        idCompteur: (newInfoUser?.idCompteur && newInfoUser?.idCompteur !== '') ? (newInfoUser?.idCompteur) : clientOnBD?.idCompteur,
        localisation: {
            longitude: (newInfoUser?.longitude) ? (newInfoUser?.longitude) : clientOnBD?.longitude,
            latitude: (newInfoUser?.latitude) ? (newInfoUser?.latitude) : clientOnBD?.latitude,
            description: (newInfoUser?.description) ? (newInfoUser?.description) : clientOnBD?.description
        },
    }
    return client;
}

const updatePassword = catchAsync((req, res) => {
    const token = authorization(req)
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
        if (err) {
            console.log('token error :', err);
        } else {
            await Client
                .findById(decodedToken.id)
                .then(async client => {
                    if (client) {
                        const bcryptPassword = await bcrypt.hash(newPassword, 8);
                        const comparePassword = await client.isPasswordMatch(oldPassword);
                        if (comparePassword) {
                            const idUser = mongoose.Types.ObjectId("" + decodedToken.id);
                            const update = await Client.findByIdAndUpdate({ _id: idUser }, { password: bcryptPassword })
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

const updateById = catchAsync(async (req, res) => {
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

    if (phone.length > 0) {
        for (let index = 0; index < phone.length; index++) {
            const element = phone[index];
            if (error === '') {
                const admins = await Admin.find({ phone: element });
                console.log(admins);
                if (admins.length <= 0) {
                    let clients = await Client.find({ phone: element });
                    if (clients.length > 0) {
                        let client = clients[0];

                        if ((client && client._id !== idClient)) {
                            error = "User with this phone exist";
                        }
                    }
                } else {
                    error = "One Admin have this phone";
                }
            }
        }

        if (error === '') {
            return Client.findOne({ customerReference }).then(async result => {
                if (result && result._id === idClient) {
                    let client = {};

                    if (name && name !== '') {
                        client = {
                            name
                        }
                    }

                    if (phone) {
                        client = {
                            ...client,
                            phone
                        }
                    }

                    if (description) {
                        client = {
                            ...client,
                            description
                        }
                    }

                    if (subscriptionDate && subscriptionDate !== 'not') {
                        const [year, month, day] = subscriptionDate.split('-')
                        const date = new Date(year, month - 1, day);
                        if (date > new Date()) {
                            res.status(500).json({ status: 500, error: "date of subscription cannot be greater than date of today" })
                            return;
                        }

                        client = {
                            ...client,
                            subscriptionDate
                        }
                    }

                    if (subscriptionAmount && subscriptionAmount !== 0) {
                        client = {
                            ...client,
                            subscriptionAmount
                        }
                    }

                    if (customerReference && customerReference !== 0) {
                        client = {
                            ...client,
                            customerReference
                        }
                    }

                    if (observation && observation !== 'not') {
                        client = {
                            ...client,
                            observation
                        }
                    }

                    if (profileImage && profileImage !== '') {
                        client = {
                            ...client,
                            profileImage
                        }
                    }

                    if (idCompteur) {
                        client = {
                            ...client,
                            idCompteur
                        }
                    }
                    const idUser = mongoose.Types.ObjectId("" + idClient);
                    const result = await Client.findByIdAndUpdate({ _id: idUser }, checkField(user, client));
                    // const result = await Client.findByIdAndUpdate(idClient, checkField(user, client));
                    if (result) {
                        res.status(200).json({ status: 200, result: result })
                    } else {
                        res.status(500).json({ status: 500, error: "Error during the update" })
                    }
                } else {
                    res.status(500).json({ status: 500, error: "user with this id reference exist <-_->" })
                }
            });
        } else {
            res.status(500).json({ status: 500, error });
        }
    } else {
        res.status(500).json({ status: 500, error: 'Please add phone number' });
    }
})

const logout = (req, res) => {
    res.cookie('pwftoken', '', { maxAge: 1 })
    res.status(200).json({ status: 200, result: "You are log out" })
}

const getOneClient = catchAsync(async (req, res) => {
    const id = req.params.idClient
    return Client
        .findById(id)
        .then(response => {
            if (response) {
                res.status(200).json({ status: 200, result: response });
            } else {
                res.status(500).json({ status: 500, error: "This client don't exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ status: 500, error: "Error" })
        })
})

const getClientByToken = catchAsync((req, res) => {
    const token = authorization(req)

    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
        if (err) {
            console.log('token error :', err);
        } else {
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
                    res.status(500).json({ status: 500, error: "Error" })
                })
        }
    })


});

const dashboard = catchAsync(async (req, res) => {
    const token = authorization(req);
    let numberFacturePaid = 0;
    let numberFactureInvoice = 0;
    let numberFacture = 0;
    let client = null;
    let facturePaid = [];
    let factureInvoice = [];
    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
        if (err) {
            console.log('token error :', err);
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

    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
        if (err) {
            console.log('token error :', err);
        } else {
            return Client
                .find({ status: true })
                .then(response => {
                    if (response) {
                        res.status(200).json({ status: 200, result: response.length });
                    } else {
                        res.status(500).json({ status: 500, error: "This admin don't exist" })
                    }
                })
                .catch(err => {
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