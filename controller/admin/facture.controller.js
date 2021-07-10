const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture } = require('../../models/index');
const jwt = require('jsonwebtoken')

const addFacture = catchAsync(async(req, res) => {
    const token = req.cookies.pwftoken
    return jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
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
                montantImpaye: req.body.montantImpaye,
                montantVerse: req.body.amountPayed,
                dataLimitePaid: req.body.dataLimitePaid,
                dateReleveOldIndex: req.body.dateReleveOldIndex,
            }
            return Admin.findById(decodedToken.id)
                .then(res => {
                    if (res) {
                        return Facture.create(facture)
                            .then(res => {
                                if (res) {
                                    res.status(200).json({ status: 200, result: res })
                                } else {
                                    res.status(500).json({ status: 200, error: "Error during the update" })
                                }
                            })
                    }
                })

        }
    })
})

const getFactures = catchAsync((req, res) => {
    Facture
        .find()
        .sort({ createdAt: -1 })
        .then(factures => {
            if (factures) {
                res.status(200).json({ status: 200, result: factures })
            } else {
                res.status(500).json({ status: 500, error: "Error while the find factures" })
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

const updateFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    console.log(idFacture);
    const token = req.cookies.pwftoken
    return jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
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
                montantImpaye: req.body.montantImpaye,
                montantVerse: req.body.amountPayed,
                dataLimitePaid: req.body.dataLimitePaid,
                dateReleveOldIndex: req.body.dateReleveOldIndex,
            }
            return Admin.findById(decodedToken.id)
                .then(res => {
                    if (res) {
                        return Facture.findByIdAndUpdate(idFacture, facture)
                            .then(res => {
                                if (res) {
                                    res.status(200).json({ status: 200, result: res })
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the update" })
                                }
                            })
                    }
                })

        }
    })
})

const statusPaidFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    const status = req.body.status

    Facture.findByIdAndUpdate(idFacture, { facturePay: status })
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
    getFacture,
    updateFacture,
    statusPaidFacture
}