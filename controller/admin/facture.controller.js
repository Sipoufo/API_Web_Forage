const catchAsync = require('../../utils/catchAsync');
const { Admin, Facture, Client, StaticInf } = require('../../models/index');
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
            // const montantVerse = req.body.montantVerse;
            const dateReleveNewIndex = new Date(req.body.dateReleveNewIndex);
            let oldIndex = (req.body.oldIndex) ? req.body.oldIndex : null;
            const monthDate = new Date().getMonth() + 1;
            const yearDate = new Date().getFullYear();
            let doFacture = true;
            let surplus = 0;

            // for pre-create invoice
            let indexFacture = null
            let isprecreate = false
            let idFacturePre = null

            await Facture
                .find({ idClient })
                .sort({ createdAt: -1 })
                .then(async factures => {
                    if (factures.length > 0) {
                        for (let i = 0; i < factures.length; i++) {
                            console.log(factures[i].dateFacturation.getMonth())
                            if (factures[i].dateFacturation.getMonth() == monthDate && factures[i].dateFacturation.getFullYear() == yearDate && factures[i].preCreate == true) {
                                doFacture = false;
                                break;
                            }else if (factures[i].preCreate == false){
                                indexFacture = i
                                isprecreate = true
                                idFacturePre = factures[i]._id
                            }
                        }
                    }
                    if (doFacture == true && isprecreate == false) {
                        if (factures.length >= 1) {
                            oldIndex = factures[0].newIndex;
                            surplus = factures[0].surplus
                        }
                        await Admin.findById(decodedToken.id)
                            .then(async(admin) => {
                                if (admin) {
                                    const static = await StaticInf.find().sort({ createdAt: 1 })
                                    const prixUnitaire = static[0].prixUnitaire;
                                    const fraisEntretien = static[0].fraisEntretien;
                                    const consommation = newIndex - oldIndex;
                                    const montantConsommation = (consommation * prixUnitaire) + fraisEntretien - surplus;
                                    // const dateFacturation = new Date();
                                    const montantImpaye = montantConsommation;
                                    const dayLimit = await StaticInf.find().sort({createdAt : -1})
                                    const dataLimitePaid = new Date(dateReleveNewIndex.getFullYear(), dateReleveNewIndex.getMonth(), dayLimit[0].createdAt.getDate(), dateReleveNewIndex.getHours() + 1, dateReleveNewIndex.getMinutes(), dateReleveNewIndex.getMilliseconds());
                                    
                                    await Facture.create({ idClient, idAdmin, dateReleveNewIndex, newIndex, oldIndex, consommation, prixUnitaire, fraisEntretien, montantConsommation, dataLimitePaid, montantImpaye })
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
                    } else if(doFacture == true && isprecreate == true) {
                        const static = await StaticInf.find().sort({ createdAt: 1 })
                        const prixUnitaire = static[0].prixUnitaire;
                        const fraisEntretien = static[0].fraisEntretien;
                        const new_Consommation = newIndex - oldIndex;
                        const old_Consommation = factures[indexFacture].newIndex - factures[indexFacture].oldIndex;
                        const final_Consommation = new_Consommation + old_Consommation
                        const montantConsommation = (final_Consommation * prixUnitaire) + fraisEntretien - surplus;
                        const dataLimitePaid = new Date(dateReleveNewIndex.getFullYear(), dateReleveNewIndex.getMonth(), dayLimit[0].createdAt.getDate(), dateReleveNewIndex.getHours() + 1, dateReleveNewIndex.getMinutes(), dateReleveNewIndex.getMilliseconds());

                        await Facture.findByIdAndUpdate(idFacturePre, {idClient, idAdmin, dateReleveNewIndex, newIndex : factures[indexFacture].newIndex, oldIndex : factures[indexFacture].oldIndex, consommation: final_Consommation, montantConsommation, dataLimitePaid})
                    }else {
                        res.status(500).json({ status: 500, error: "This customer already has an invoice for this month" });
                    }

                })


        }
    })
})

const addInformation = catchAsync(async(req, res) => {
    const prixUnitaire = req.body.prixUnitaire
    const fraisEntretien = req.body.fraisEntretien
    const limiteDay = req.body.limiteDay
    const token = authorization(req)
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" })
                .then(async result => {
                    if (result) {
                        const staticResult = await StaticInf.create({ idAdmin: decodedToken.id, prixUnitaire, fraisEntretien, limiteDay })
                        if (staticResult) {
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

});

const getAllFacture = catchAsync((req, res) => {
    Facture
        .find()
        .sort({ createdAt: 1 })
        .then(factures => {
            res.status(200).json({ status: 200, result: factures })
        })
})

const haveInvoice = catchAsync((req, res) => {
    const idClient = req.params.idClient;
    let have
    Facture
        .find({ idClient })
        .then(factures => {
            if(factures.length > 0) {
                have = true
            }else {
                have = false
            }
            res.status(200).json({ status: 200, result: have })
        })
})

const seeUnpaidInvoicewithDate = catchAsync(async (req, res) => {
    // const dateUnpaid = new Date(req.params.dateUnpaid)
    const dateUnpaidMonth = new Date(req.params.dateUnpaid).getMonth() + 1
    const dateUnpaidYear= new Date(req.params.dateUnpaid).getFullYear()
    console.log(dateUnpaidYear)
    let invoiceUnpaid = []
    Client.find()
        .sort({name : 0})
        .then(async customers => {
            for (let i = 0; i < customers.length; i++) {
                let invoiceCustomer = await Facture.aggregate([
                    {
                        $project: {_id: 1, client: '$idClient' , month: {$month: '$createdAt'}, year: {$year: '$createdAt'}}
                    },
                    {
                        $match: {month: dateUnpaidMonth, year: dateUnpaidYear, client: customers[i]}
                    }
                ]);
                if (invoiceCustomer.length == 0) {
                    invoiceUnpaid.push(customers[i])
                }
                console.log(invoiceUnpaid)
            }
            res.status(200).json({ status: 200, result: invoiceUnpaid })
        })
})

const getStaticInformation = catchAsync((req, res) => {
    const staticInf = []
    StaticInf
        .find()
        .sort({ createdAt: 1 })
        .then(static => {
            if (static) {
                for (let i = 0; i < static.length; i++) {
                    staticInf.push(static[i])
                }
            }
            res.status(200).json({ status: 200, result: staticInf })
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
                        const static = await StaticInf.find().sort({ createdAt: 1 })
                        const prixUnitaire = static[0].prixUnitaire;
                        const fraisEntretien = static[0].fraisEntretien;
                        const montantConsommation = (consommation * prixUnitaire) + fraisEntretien + penalite
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
    let surplus = 0

    await Facture.findById(idFacture)
        .then(async result => {
            if (result) {
                if (result.facturePay != true) {
                    const newUnpaid = result.montantImpaye - amount
                    const newAmountPaid = result.montantVerse + amount
                    if (newUnpaid >= 0) {
                        if (newUnpaid != 0) {
                            status = false
                        } else {
                            status = true
                        }
                    } else {
                        surplus = newUnpaid * (-1)
                        newUnpaid = 0
                    }
                    await Facture.findByIdAndUpdate(idFacture, { facturePay: status, montantImpaye: newUnpaid, montantVerse: newAmountPaid, surplus, $push: { tranche: { montant: amount, date: new Date() } } })
                        .then(facture => {
                            if (facture) {
                                res.status(200).json({ status: 200, result: facture })
                            } else {
                                res.status(500).json({ status: 500, error: "Error during the update" })
                            }
                        })
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
    getOneInvoiceByYear,
    addInformation,
    getStaticInformation,
    seeUnpaidInvoicewithDate,
    haveInvoice
}