const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client } = require('../../models/index');
const jwt = require('jsonwebtoken')

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const addFacture = catchAsync(async(req, res) => {
    // const token = req.cookies.pwftoken
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            const idClient = req.params.idClient;
            const idAdmin = decodedToken.id;
            const newIndex = req.body.newIndex;
            const observation = req.body.observation;
            const penalite = (req.body.penalite) ? req.body.penalite : 0;
            const dataPaid = req.body.dataPaid;
            const montantVerse = req.body.montantVerse;
            const dateReleveNewIndex = new Date(req.body.dateReleveNewIndex);
            let oldIndex = req.body.oldIndex;
            const monthDate = new Date().getMonth() + 1
            let doFacture = true

            await Facture
                .find({ idClient })
                .sort({ createdAt: -1 })
                .then(async factures => {
                    if (factures.length > 0) {
                        for (let i = 0; i < factures.length; i++) {
                            console.log(factures[i].dateFacturation.getMonth())
                            if (factures[i].dateFacturation.getMonth() == monthDate) {
                                doFacture = false;
                                break;
                            }
                        }
                    }
                    if (doFacture == true) {
                        if (factures.length >= 1) {
                            oldIndex = factures[0].newIndex;
                        }
                        await Admin.findById(decodedToken.id)
                            .then(async(admin) => {
                                if (admin) {
                                    const consommation = newIndex - oldIndex;
                                    const montantConsommation = (consommation * 500) + 1000 + penalite;
                                    const dateFacturation = new Date();
                                    const montantImpaye = montantConsommation - montantVerse;
                                    const dataLimitePaid = new Date(dateFacturation.getFullYear(), dateFacturation.getMonth(), dateFacturation.getDate() + 10, dateFacturation.getHours(), dateFacturation.getMinutes(), dateFacturation.getMilliseconds());
                                    const prixUnitaire = 500;
                                    const fraisEntretien = 1000;
                                    await Facture.create({ idClient, idAdmin, newIndex, oldIndex, consommation, prixUnitaire, fraisEntretien, montantConsommation, observation, dateReleveNewIndex, dateFacturation, dataLimitePaid, dataPaid, montantVerse, montantImpaye, penalite })
                                        .then(resp => {
                                            if (resp) {
                                                res.status(200).json({ status: 200, result: resp });
                                            } else {
                                                res.status(500).json({ status: 500, error: "Error during the save" });
                                            }
                                        });
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the save" });
                                }
                            });
                    } else {
                        res.status(500).json({ status: 500, error: "This customer already has an invoice for this month" });
                    }

                })


        }
    })
})

const getAllFacture = catchAsync((req, res) => {
    Facture
        .find()
        .sort({ createdAt: 1 })
        .then(factures => {
            res.status(200).json({ status: 200, result: factures })
        })
})

const getFactures = catchAsync((req, res) => {
    const month = (req.params.month) ? req.params.month : new Date().getMonth() + 1;
    const year = (req.params.year) ? req.params.year : new Date().getFullYear();
    const page = (req.params.page) ? req.params.page : 1;
    const limit = (req.params.limit) ? req.params.limit : 10;
    const facture = [];
    Facture
        .paginate({}, { page, limit })
        .then(factures => {
            for (let i = 0; i < factures.docs.length; i++) {
                const monthInvoice = factures.docs[i].createdAt.getMonth() + 1;
                const yearInvoice = factures.docs[i].createdAt.getFullYear();
                console.log(monthInvoice)
                console.log(yearInvoice)
                if (monthInvoice == month && yearInvoice == year) {
                    facture.push(factures.docs[i]);
                }
            }
            res.status(200).json({ status: 200, result: facture })
        })
});

const getFactureOne = catchAsync((req, res) => {
    const idFacture = req.params.idFacture
    console.log(idFacture);
    Facture.findById(idFacture)
        .then(facture => {
            if (facture) {
                res.status(200).json({ status: 200, result: facture })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find facture" })
            }
        })
});

const getClientFactures = catchAsync((req, res) => {
    const idClient = req.params.idClient
    Facture
        .find({ idClient })
        .sort({ createdAt: -1 })
        .then(factures => {
            if (factures.length > 0) {
                res.status(200).json({ status: 200, result: factures })
            } else {
                res.status(500).json({ status: 500, error: "Error during the find factures" })
            }
        })
});

const findByYear = catchAsync((req, res) => {
    const year = req.params.year
    let result = []
    console.log(year)
    Facture
        .find()
        .sort({ createdAt: 1 })
        .then(factures => {
            if (factures.length > 0) {
                for (let i = 0; i < factures.length; i++) {
                    const yearFacture = factures[i].createdAt.getFullYear()
                    console.log(yearFacture);
                    if (yearFacture == year) {
                        result.push(factures[i])
                    }
                }
            }
            res.status(200).json({ status: 200, result })
        })
})

const getOneInvoiceByYear = catchAsync((req, res) => {
    const year = req.params.year
    const idClient = req.params.idClient
    let result = []
    console.log(idClient)
    Facture
        .find({ idClient })
        .sort({ createdAt: 1 })
        .then(factures => {
            console.log(factures)
            if (factures.length > 0) {
                for (let i = 0; i < factures.length; i++) {
                    const yearFacture = factures[i].createdAt.getFullYear()
                    console.log(yearFacture);
                    if (yearFacture == year) {
                        result.push(factures[i])
                    }
                }
            }
            res.status(200).json({ status: 200, result })
        })
})

const getFactureAdvance = catchAsync(async(req, res) => {
    let EndFactureAdvance = []
    await Facture
        .find()
        .sort({ createdAt: -1 })
        .then(factures => {
            console.log(factures)
            if (factures.length > 0) {
                for (let i = 0; i < factures.length; i++) {
                    if (factures[i].montantImpaye == 0) {
                        EndFactureAdvance.push(factures[i])
                    }
                }
                res.status(200).json({ status: 200, result: EndFactureAdvance })
            } else {
                res.status(500).json({ status: 500, error: "I don't see the facture" })
            }
        })
})

const updateFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    console.log(idFacture);
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            const newIndex = req.body.newIndex;
            const observation = req.body.observation;
            const penalite = (req.body.penalite) ? req.body.penalite : 0;
            const montantVerse = req.body.montantVerse;
            const dateReleveNewIndex = req.body.dateReleveOldIndex;
            await Admin.findById(decodedToken.id)
                .then(async(res) => {
                    if (res) {
                        const consommation = newIndex - oldIndex
                        const montantConsommation = (consommation * 500) + 1000 + penalite
                        const montantImpaye = montantConsommation - montantVerse
                        await Facture.findByIdAndUpdate(idFacture, { newIndex, observation, penalite, montantVerse, dateReleveNewIndex, consommation, montantConsommation, montantImpaye })
                            .then(res => {
                                if (res) {
                                    res.status(200).json({ status: 200, result: res });
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the update" });
                                }
                            });
                    }
                });

        }
    })
})

const statusPaidFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    let status
    const amount = req.body.amount

    await Facture.findById(idFacture)
        .then(async result => {
            if (result) {
                if (result.facturePay != true) {
                    const newUnpaid = result.montantImpaye - amount
                    const newAmountPaid = result.montantVerse + amount
                    if (newUnpaid >= 0) {
                        if (newUnpaid > 0) {
                            status = false
                        } else {
                            status = true
                        }
                        await Facture.findByIdAndUpdate(idFacture, { facturePay: status, montantImpaye: newUnpaid, montantVerse: newAmountPaid, $push: { tranche: { montant: amount, date: new Date() } } })
                            .then(facture => {
                                if (facture) {
                                    res.status(200).json({ status: 200, result: facture })
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the update" })
                                }
                            })
                    } else {
                        res.status(500).json({ status: 500, error: "Your amount is so high" })
                    }
                } else {
                    res.status(500).json({ status: 500, error: "This facture is already paid" })
                }

            } else {
                res.status(500).json({ status: 500, error: "This facture don't exist" })
            }
        })
})

const getByStatus = catchAsync(async(req, res) => {
    const status = req.params.status
    await Facture
        .find({ facturePay: status })
        .sort({ createdAt: -1 })
        .then(factures => {
            if (factures.length > 0) {
                res.status(200).json({ status: 200, result: factures })
            } else {
                res.status(500).json({ status: 500, error: "I don't see a facture with this status" })
            }
        })
})


module.exports = {
    addFacture,
    getAllFacture,
    getFactures,
    getClientFactures,
    updateFacture,
    statusPaidFacture,
    getFactureAdvance,
    getByStatus,
    getFactureOne,
    findByYear,
    getOneInvoiceByYear
}