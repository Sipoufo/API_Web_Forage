const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client } = require('../../models/index');
const jwt = require('jsonwebtoken')

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const deleteCompteClient = catchAsync(async(req, res) => {
    const idClient = req.body.idClient
    const isDelete = req.body.isDelete
    await Client.findById(idClient)
        .then(async result => {
            if (result) {
                const clientResult = await Client.findByIdAndUpdate(result._id, { isDelete })
                if (clientResult) {
                    res.status(200).json({ status: 200, result: clientResult });
                } else {
                    res.status(500).json({ status: 500, error: "Error during the update" });
                }
            } else {
                res.status(500).json({ status: 500, error: "I don't see this user" });
            }
        })
})

const deleteCompteAdmin = catchAsync(async(req, res) => {
    const idAdmin = req.params.idAdmin
    const isDelete = req.body.isDelete
    await Admin.findById(idAdmin)
        .then(async result => {
            if (result) {
                const adminResult = await Admin.findByIdAndUpdate(result._id, { isDelete })
                if (adminResult) {
                    res.status(200).json({ status: 200, result: adminResult });
                } else {
                    res.status(500).json({ status: 500, error: "Error during the update" });
                }
            } else {
                res.status(500).json({ status: 500, error: "I don't see this admin" });
            }
        })
})


module.exports = {
    deleteCompteClient,
    deleteCompteAdmin,
}