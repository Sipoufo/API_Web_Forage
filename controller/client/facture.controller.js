const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client } = require('../../models/index');
const jwt = require('jsonwebtoken')

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const getFactures = catchAsync(async(req, res) => {
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Facture
                .find({ idClient: decodedToken.id })
                .sort({ createdAt: -1 })
                .then(factures => {
                    if (factures.length > 0) {
                        res.status(200).json({ status: 200, result: factures });
                    } else {
                        res.status(200).json({ status: 200, result: factures });
                    }
                });
        }
    })

})

const getFacturesWithDate = catchAsync(async(req, res) => {
    const token = authorization(req)
    let result = []
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Facture
                .find({ idClient: decodedToken.id, facturePay: true })
                .sort({ createdAt: -1 })
                .then(factures => {
                    for (let i = 0; i < factures.length; i++) {
                        const date = " " + (factures[i].dateFacturation.getFullYear() + 1) + "-" + (factures[i].dateFacturation.getMonth() + 1)
                        const lengthtTranche = factures[i].tranche.length
                        result.push({ date, montant: factures[i].montantConsommation, tranche: lengthtTranche })
                    }
                    console.log(result)
                    res.status(200).json({ status: 200, result: result });
                });
        }
    })

})

const statusPaidFacture = catchAsync(async(req, res) => {
    const montant = req.body.montant
    const token = authorization(req)
    const idFacture = req.params.idFacture
    let status = false

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Facture.findById(idFacture)
                .then(async result => {
                    if (result.facturePay == false) {
                        if (result) {
                            const newVerse = result.montantVerse + montant
                            const newImpaye = result.montantImpaye - montant
                            if (newImpaye == 0) {
                                status = true
                            }
                            if (newImpaye >= 0) {
                                await Facture
                                    .findByIdAndUpdate(idFacture, { facturePay: status, montantVerse: newVerse, montantImpaye: newImpaye, $push: { tranche: { montant, date: new Date() } } })
                                    .then(factures => {
                                        if (factures) {
                                            res.status(200).json({ status: 200, result: factures });
                                        } else {
                                            res.status(500).json({ status: 500, error: "Error while the find factures" });
                                        }
                                    });
                            } else {
                                res.status(500).json({ status: 500, error: "You must enter a valid amount" });
                            }

                        } else {
                            res.status(500).json({ status: 500, error: "This facture don't exist" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "This facture is already OK" });
                    }

                })

        }
    })
})

const factureWithDate = catchAsync(async(req, res) => {
    const token = authorization(req)
    const status = req.params.status
    const EndFactureAdvance = []
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            Facture
                .find({ idClient: decodedToken.id, facturePay: status })
                .sort({ createdAt: -1 })
                .then(async factures => {
                    if (factures.length >= 0) {
                        for (let i = 0; i < factures.length; i++) {
                            const month = await Facture.aggregate([{
                                $project: {
                                    month: { $month: "$createdAt" },
                                }
                            }])

                            EndFactureAdvance.push({ facture: factures[i], month })
                        }
                        res.status(200).json({ status: 200, result: EndFactureAdvance })
                    } else {
                        res.status(500).json({ status: 500, error: "I don't see the facture" })
                    }
                })
        }
    })
})

const getFactureAdvance = catchAsync(async(req, res) => {
    const token = authorization(req);
    const EndFactureAdvance = [];
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            Facture
                .find({ idClient: decodedToken.id })
                .sort({ createdAt: -1 })
                .then(factures => {
                    if (factures > 0) {
                        for (let i = 0; i < factures.length; i++) {
                            if (factures[i].montantImpaye == 0) {
                                EndFactureAdvance.push(factures[i])
                            }
                        }
                        res.status(200).json({ status: 200, result: EndFactureAdvance })
                    } else {
                        res.status(200).json({ status: 200, result: EndFactureAdvance })
                    }
                })
        }
    })
})

const advanceFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    const AdvanceCount = req.body.AdvanceCount
    const advanceDate = req.params.advanceDate
    const token = authorization(req)

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Facture
                .findOne({ _id: idFacture, idClient: decodedToken.id })
                .then(async(facture) => {
                    if (facture) {
                        const montant = facture.montantConsommation;
                        const reset = (montant - AdvanceCount);
                        const factureAd = await Facture.findByIdAndUpdate(idFacture, { montantVerse: AdvanceCount, montantImpaye: reset });
                        await Client.findByIdAndUpdate(decodedToken.id, {
                            $push: {
                                advanceFacture: { AdvanceCount, advanceDate, reset }
                            }
                        });
                        res.status(200).json({ status: 200, result: factureAd });
                    } else {
                        res.status(500).json({ status: 500, error: "This facture don't exist ou it's not for you" });
                    }
                });
        }
    })
})

module.exports = {
    getFactures,
    statusPaidFacture,
    advanceFacture,
    getFactureAdvance,
    factureWithDate,
    getFacturesWithDate
}