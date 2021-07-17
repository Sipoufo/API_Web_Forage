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
            const facture = {
                idClient: req.params.idClient,
                idAdmin: decodedToken.id,
                newIndex: req.body.newIndex,
                oldIndex: req.body.oldIndex,
                consommation: req.body.consommation,
                prixUnitaire: req.body.consommation,
                montantConsommation: req.body.montantConsommation,
                fraisEntretien: req.body.fraisEntretien,
                montantTotal: req.body.montantTotal,
                dataLimitePaid: req.body.dataLimitePaid,
                dateReleveOldIndex: req.body.dateReleveOldIndex,
            };
            await Admin.findById(decodedToken.id)
                .then(async(admin) => {
                    if (admin) {
                        await Facture.create(facture)
                            .then(resp => {
                                if (resp) {
                                    res.status(200).json({ status: 200, result: resp });
                                } else {
                                    res.status(500).json({ status: 200, error: "Error during the update" });
                                }
                            });
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

const getWithStatus = catchAsync((req, res) => {
    const status = req.body.status
    Facture
        .find({ status })
        .sort({ createdAt: -1 })
        .then(factures => {
            if (factures > 0) {
                res.status(200).json({ status: 200, result: factures })
            } else {
                res.status(500).json({ status: 500, error: "I don't see the facture with this status" })
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
            const facture = {
                idClient: req.params.idClient,
                idAdmin: decodedToken.id,
                newIndex: req.body.newIndex,
                oldIndex: req.body.oldIndex,
                consommation: req.body.consommation,
                prixUnitaire: req.body.consommation,
                montantConsommation: req.body.montantConsommation,
                fraisEntretien: req.body.fraisEntretien,
                montantTotal: req.body.montantTotal,
                dataLimitePaid: req.body.dataLimitePaid,
                dateReleveOldIndex: req.body.dateReleveOldIndex,
            };
            await Admin.findById(decodedToken.id)
                .then(async(res) => {
                    if (res) {
                        await Facture.findByIdAndUpdate(idFacture, facture)
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


module.exports = {
    addFacture,
    getFactures,
    getClientFactures,
    getFacture,
    updateFacture,
    statusPaidFacture,
    getFactureAdvance,
    getWithStatus
}