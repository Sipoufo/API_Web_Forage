const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const admin = require('../../models/administrateur.model')
const client = require('../../models/client.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const { Facture, Client } = require('../../models/index');
const mongoose = require("mongoose");

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'Admin web forage', {
        expiresIn: maxAge
    })
}

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const register = catchAsync(async (req, res) => {
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
                            res.status(500).json({ status: 500, error: "this number exist <-_->" })
                        }
                    })
            } else {
                res.status(500).json({ status: 500, error: "One User have this phone" })
            }
        })
})

const update = catchAsync(async (req, res) => {
    const token = authorization(req)
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude

    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
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
    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
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

const updateById = catchAsync(async (req, res) => {
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
                            res.status(500).json({ status: 500, error: "this number exist <-_->" })
                        }
                    })
            } else {
                res.status(500).json({ status: 500, error: "One User have this phone" })
            }
        })
})

const sendFirstAdmin = catchAsync(async (req, res) => {
    const name = "Sipoufo Yvan"
    const phone = 695914926
    const email = "sipoufoknj@gmail.com"
    const password = "ef773dcfc029bb1c25e48dbbe188372b"
    const longitude = 12
    const latitude = 12
    const profileImage = "noPath"

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
                res.status(500).json({ status: 500, error: "this number exist <-_->" })
            }
        })
})

const getOneAdmin = catchAsync(async (req, res) => {
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
        .find({ status: true })
        .sort({ createdAt: 'descending' })
        .then(clients => {
            if (clients.length > 0) {
                res.status(200).json({ status: 200, result: clients })
            } else {
                res.status(200).json({ status: 200, result: [] })
            }
        })
})

const findClient = catchAsync((req, res) => {
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;

    let filter = {};
    if (req.body?.refId && req.body?.refId !== " " && req.body?.refId !== 0) {
        let data = {
            customerReference: req.body?.refId
        }
        filter = data;
    }

    if (req.body?.status && req.body?.status !== " ") {
        let data = {
            ...filter,
            status: req.body?.status === 'block' ? false : true
        }
        filter = data;
    }

    if (req.body?.counterId && req.body?.counterId !== " ") {
        let data = {
            ...filter,
            idCompteur: req.body?.counterId
        }
        filter = data;
    }

    if (req.body?.date && req.body?.date !== " ") {
        const [year, day, month] = req.body?.date.split('-')
        const start = new Date(year + '-' + month + '-' + day);
        const end = new Date(year + '-' + month + '-' + day);

        start.setHours(0, 59, 59, 999);
        end.setHours(23, 59, 59, 999);

        let data = {
            subscriptionDate: { $gte: start, $lt: end }
        }

        filter = {
            ...filter,
            subscriptionDate: req.body?.date
        };

        return Client
            .find(filter)
            .sort({ name: (req.body?.order && req.body?.order === 'asc' ? 1 : - 1) })
            .skip(page - 1)
            .then(response => {
                res.status(200).json({ status: 200, result: generatePaginnation(response, limit, page) });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ status: 500, error: "Error" })
            })
    } else {
        const offset = page - 1;
        return Client
            .find(filter)
            .sort({ name: (req.body?.order && req.body?.order === 'asc' ? 1 : - 1) })
            .skip(offset)

            .then(clients => {
                if (clients.length > 0) {
                    res.status(200).json({ status: 200, result: generatePaginnation(clients, limit, page) })
                } else {
                    res.status(200).json({ status: 200, result: generatePaginnation([], limit, page) })
                }
            })
    }
})

const generatePaginnation = (data, limit, page) => {
    if (data?.length > 0) {
        const totalPages = Math.floor(data.length / limit);
        let result = [];
        result = data.slice(limit * (page - 1), limit * page);
        return {
            docs: result,
            totalDocs: data.length,
            limit: limit,
            totalPages: totalPages,
            page: page,
            pagingCounter: totalPages,
            hasPrevPage: (page > 1),
            hasNextPage: (totalPages > page),
            prevPage: (page - 1),
            nextPage: (totalPages > page) ? page + 1 : page
        }
    } else {
        return {
            docs: [],
            totalDocs: 0,
            limit: limit,
            totalPages: 0,
            page: page,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 1,
            nextPage: 1
        }
    }
}

const getClientsWithPagination = catchAsync((req, res) => {
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;
    return Client
        .paginate({ status: true }, { page, limit })
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

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return Client.find({ subscriptionDate: { $gte: start, $lt: end } })
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
            jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
                if (err) {
                    console.log(err);
                } else {
                    if (admins.length > 0) {
                        for (let i = 0; i < admins.length; i++) {
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

    jwt.verify(token, 'Admin web forage', async (err, decodedToken) => {
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

const getClientsWithTotalCostUnpaid = catchAsync(async (req, res) => {
    client
        .find({ status: true })
        .sort({ createdAt: 'descending' })
        .then(async clients => {
            if (clients.length > 0) {
                let resuls = [];

                for (let index = 0; index < clients.length; index++) {
                    const element = clients[index];
                    let idClient = mongoose.Types.ObjectId("" + element._id);
                    let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
                    if (unPaidInvoices.length > 0) {
                        let montantImpaye = 0;
                        for (let index = 0; index < unPaidInvoices.length; index++) {
                            const unPaidInvoice = unPaidInvoices[index];
                            montantImpaye += unPaidInvoice.montantImpaye;
                        }

                        resuls.push({
                            client: element,
                            unpaidAmount: montantImpaye,
                        })
                    } else {
                        continue;
                    }
                }
                res.status(200).json({ status: 200, result: resuls })
            } else {
                res.status(200).json({ status: 200, result: [] })
            }
        })
})

const getClientsWithTotalCostUnpaidWithPagination = catchAsync(async (req, res) => {
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;
    const offset = page - 1;

    client
        .find({ status: true })
        .sort({ createdAt: 'ascending' })
        .skip(offset)

        .then(async clients => {
            if (clients.length > 0) {
                let resuls = [];

                for (let index = 0; index < clients.length; index++) {
                    const element = clients[index];
                    let idClient = mongoose.Types.ObjectId("" + element._id);
                    let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
                    if (unPaidInvoices.length > 0) {
                        let montantImpaye = 0;
                        for (let index = 0; index < unPaidInvoices.length; index++) {
                            const unPaidInvoice = unPaidInvoices[index];
                            montantImpaye += unPaidInvoice.montantImpaye;
                        }

                        resuls.push({
                            client: element,
                            unpaidAmount: montantImpaye,
                        })
                    } else {
                        continue;
                    }
                }

                res.status(200).json({ status: 200, result: generatePaginnation(resuls, limit, page) })
            } else {
                res.status(200).json({ status: 200, result: generatePaginnation([], limit, page) })
            }
        })
})

const getClientsWithTotalUnpaidInvoice = catchAsync(async (req, res) => {
    client
        .find({ status: true })
        .sort({ createdAt: 'ascending' })
        .then(async clients => {
            if (clients.length > 0) {
                let resuls = [];

                for (let index = 0; index < clients.length; index++) {
                    const element = clients[index];
                    let idClient = mongoose.Types.ObjectId("" + element._id);
                    let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
                    if (unPaidInvoices.length > 0) {
                        let montantImpaye = 0;
                        for (let index = 0; index < unPaidInvoices.length; index++) {
                            const unPaidInvoice = unPaidInvoices[index];
                            montantImpaye += unPaidInvoice.montantImpaye;
                        }

                        resuls.push({
                            client: element,
                            unpaidAmount: montantImpaye,
                            unPaidInvoices: unPaidInvoices
                        })
                    } else {
                        continue;
                    }
                }

                res.status(200).json({ status: 200, result: resuls })
            } else {
                res.status(200).json({ status: 200, result: [] })
            }
        })
})

const getClientsWithTotalUnpaidInvoiceWithPagination = catchAsync(async (req, res) => {
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;
    const offset = page - 1;

    client
        .find({ status: true })
        .sort({ createdAt: 'ascending' })
        .skip(offset)

        .then(async clients => {
            if (clients.length > 0) {
                let resuls = [];

                for (let index = 0; index < clients.length; index++) {
                    const element = clients[index];
                    let idClient = mongoose.Types.ObjectId("" + element._id);
                    let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
                    if (unPaidInvoices.length > 0) {
                        let montantImpaye = 0;
                        for (let index = 0; index < unPaidInvoices.length; index++) {
                            const unPaidInvoice = unPaidInvoices[index];
                            montantImpaye += unPaidInvoice.montantImpaye;
                        }

                        resuls.push({
                            client: element,
                            unpaidAmount: montantImpaye,
                            unPaidInvoices: unPaidInvoices
                        })
                    } else {
                        continue;
                    }
                }
                res.status(200).json({ status: 200, result: generatePaginnation(resuls, limit, page) })
            } else {
                res.status(200).json({ status: 200, result: generatePaginnation([], limit, page) })
            }
        })
})

const totalCostUnpaidByClient = async (idClient) => {
    try {
        idClient = mongoose.Types.ObjectId("" + idClient);
        let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
        let montantImpaye = 0;
        if (unPaidInvoices.length > 0) {
            for (let index = 0; index < unPaidInvoices.length; index++) {
                const unPaidInvoice = unPaidInvoices[index];
                montantImpaye += unPaidInvoice.montantImpaye;
            }
        }
        return montantImpaye;
    } catch (error) {
        return 0;
    }
};

const totalUnpaidInvoiceByClient = async (idClient) => {
    try {
        idClient = mongoose.Types.ObjectId("" + idClient);
        let unPaidInvoices = await Facture.find({ facturePay: false, idClient })
        let montantImpaye = 0;
        if (unPaidInvoices.length > 0) {
            for (let index = 0; index < unPaidInvoices.length; index++) {
                const unPaidInvoice = unPaidInvoices[index];
                montantImpaye += unPaidInvoice.montantImpaye;
            }
        }
        return {
            unpaidAmount: montantImpaye,
            unPaidInvoices: unPaidInvoices.length > 0 ? unPaidInvoices : []
        };
    } catch (error) {
        return {
            unpaidAmount: 0,
            unPaidInvoices: []
        };
    }
};

module.exports = {
    register,
    sendFirstAdmin,
    getClientsWithTotalCostUnpaid,
    getClientsWithTotalUnpaidInvoice,
    getClientsWithTotalUnpaidInvoiceWithPagination,
    getClientsWithTotalCostUnpaidWithPagination,
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