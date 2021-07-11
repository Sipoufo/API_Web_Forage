const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture } = require('../../models/index');
const jwt = require('jsonwebtoken')

const getFactures = catchAsync((req, res) => {
    const token = req.cookies.pwftoken
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
        } else {
            Facture
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
    const token = req.cookies.pwftoken
    const idFacture = req.params.idFacture

    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err)
        } else {
            Facture
                .findOneAndUpdate({ idClient: decodedToken.id, _id: idFacture }, { facturePay: status })
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

module.exports = {
    getFactures,
    statusPaidFacture
}