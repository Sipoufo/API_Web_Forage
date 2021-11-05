const catchAsync = require('../../utils/catchAsync');
const { Admin, Penalty } = require('../../models/index');
const jwt = require('jsonwebtoken');

const addInformation = catchAsync(async(req, res) => {
    const prixUnitaire = req.body.prixUnitaire
    const fraisEntretien = req.body.fraisEntretien
    const limiteDay = req.body.limitedate
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" })
                .then(async result => {
                    if (result) {
                        const staticResult = await StaticInf.create({ idAdmin: decodedToken.id, prixUnitaire, fraisEntretien, limiteDay })
                        if (adminResult) {
                            res.status(200).json({ status: 200, result: staticResult });
                        } else {
                            res.status(500).json({ status: 500, error: "Error while the creation" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "Your are not super administrator" });
                    }
                })
        }
    })

})

module.exports = {
    addInformation
}