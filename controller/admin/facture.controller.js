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
            const dateReleveNewIndex = req.body.dateReleveOldIndex;
            let oldIndex = req.body.oldIndex

            await Facture
                .find({ idClient })
                .sort({ createdAt: -1 })
                .then(async factures => {
                    if (factures.length > 2) {
                        oldIndex = factures[2].newIndex
                    }
                })
            await Admin.findById(decodedToken.id)
                .then(async(admin) => {
                    if (admin) {
                        const consommation = newIndex - oldIndex
                        const montantConsommation = (consommation * 500) + 1000 + penalite
                        const dateFacturation = new Date()
                        const montantImpaye = montantConsommation - montantVerse
                        const dataLimitePaid = new Date(dateFacturation.getFullYear(), dateFacturation.getMonth() + 1, dateFacturation.getDate(), dateFacturation.getHours(), dateFacturation.getMinutes(), dateFacturation.getMilliseconds())
                        await Facture.create({ idClient, idAdmin, newIndex, oldIndex, consommation, prixUnitaire: 500, fraisEntretien: 1000, montantConsommation, observation, dateReleveNewIndex, dateFacturation, dataLimitePaid, dataPaid, montantVerse, montantImpaye })
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

        }
    })
})

const getFactures = catchAsync((req, res) => {
    Facture
        .find()
        .sort({ createdAt: -1 })
        .then(factures => {
            if (factures.length > 0) {
                res.status(200).json({ status: 200, result: factures })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find factures" })
            }
        })
})

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
})

const getFacture = catchAsync((req, res) => {
    const idFacture = req.params.idFacture
    Facture.findById(idFacture)
        .then(facture => {
            if (facture) {
                res.status(200).json({ status: 200, result: facture })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find facture" })
            }
        })
})

const getFactureAdvance = catchAsync(async(req, res) => {
    const EndFactureAdvance = []
    await Facture
        .find()
        .sort({ createdAt: -1 })
        .then(factures => {
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
    const status = req.body.status

    await Facture.findByIdAndUpdate(idFacture, { facturePay: status })
        .then(facture => {
            if (facture) {
                res.status(200).json({ status: 200, result: facture })
            } else {
                res.status(500).json({ status: 500, error: "Error during the update" })
            }
        })
})

const getByStatus = catchAsync(async(req, res) => {
    const status = req.body.status

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
    getFactures,
    getClientFactures,
    getFacture,
    updateFacture,
    statusPaidFacture,
    getFactureAdvance,
    getByStatus
}