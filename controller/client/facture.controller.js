const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client } = require('../../models/index');
const jwt = require('jsonwebtoken')

const getFactures = catchAsync(async(req, res) => {
    const token = req.cookies.pwftoken
    await jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
        } else {
            await Facture
                .find({ idClient: decodedToken.id })
                .sort({ createdAt: -1 })
                .then(factures => {
                    if (factures.length > 0) {
                        res.status(200).json({ status: 200, result: factures })
                    } else {
                        res.status(500).json({ status: 500, error: "Error while the find factures" })
                    }
                })
        }
    })

})

const statusPaidFacture = catchAsync(async(req, res) => {
    const status = req.body.status
    const montant = req.body.montant
    const token = req.cookies.pwftoken
    const idFacture = req.params.idFacture

    await jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
        } else {
            await Facture
                .findOneAndUpdate({ idClient: decodedToken.id, _id: idFacture }, { facturePay: status, montantVerse: montant })
                .then(factures => {
                    if (factures.length > 0) {
                        res.status(200).json({ status: 200, result: factures })
                    } else {
                        res.status(500).json({ status: 500, error: "Error while the find factures" })
                    }
                })
        }
    })
})

const advanceFacture = catchAsync(async(req, res) => {
    const idFacture = req.params.idFacture
    const AdvanceCount = req.body.AdvanceCount
    const advanceDate = req.params.advanceDate
    const token = req.cookies.pwftoken

    await jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
        } else {
            await Facture
                .findOne({ _id: idFacture, idClient: decodedToken.id })
                .then(async facture => {
                    if (facture) {
                        const montant = facture.montantTotal
                        const reset = (montant - AdvanceCount)
                        const factureAd = await Facture.findByIdAndUpdate(idFacture, { montantVerse: AdvanceCount, montantImpaye: reset })
                        await Client.findByIdAndUpdate(decodedToken.id, { idFacture, AdvanceCount, advanceDate, reset })
                        res.status(200).json({ status: 200, result: factureAd })
                    } else {
                        res.status(500).json({ status: 500, error: "This facture don't exist ou it's not for you" })
                    }
                })
        }
    })
})

module.exports = {
    getFactures,
    statusPaidFacture,
    advanceFacture
}