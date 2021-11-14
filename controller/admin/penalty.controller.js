const catchAsync = require('../../utils/catchAsync');
const { Admin, Penalty } = require('../../models/index');
const jwt = require('jsonwebtoken');

const addPenalty = catchAsync(async(req, res) => {
    const dayActivation = req.body.dayActivation
    const pas = req.body.pas
    const amountAdd = req.body.amountAdd
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" })
                .then(async result => {
                    if (result) {
                        const penality = await Penalty.create({ dayActivation, pas, amountAdd })
                        if (penality) {
                            res.status(200).json({ status: 200, result: penality });
                        } else {
                            res.status(500).json({ status: 500, error: "Error during a creation of penalty" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "Your are not super administrator" });
                    }
                })
        }
    })

})

const removePenalty = catchAsync((req, res) => {
    const idFacture = req.params.idFacture;
    Facture
        .findById( idFacture )
        .then(factures => {
            if(factures) {
                Facture.findByIdAndUpdate(idFacture, { $push: { penalty: { montant: 0, date: new Date() } } })
                    .then(async updatePenalty => {
                        if(updatePenalty) {
                            const result = await Facture.findById(idFacture);
                            res.status(200).json({ status: 200, result });
                        } else {
                            res.status(500).json({ status: 500, error: "Error please retry" })
                        }
                    })
            }else {
                res.status(500).json({ status: 500, error: "This invoice don't exist" })
            }
        })
})

module.exports = {
    addPenalty,
    removePenalty
}