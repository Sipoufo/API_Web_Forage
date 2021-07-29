const catchAsync = require('../../utils/catchAsync');
const { Material, Type } = require('../../models/index');

const addMateriaux = catchAsync(async(req, res) => {
    const { name, type, prixUnit, quantity, description, picture } = req.body

    return Material.findOne({ name })
        .then(async response => {
            if (!response) {
                const save = await Material.create({ name, type, prixUnit, quantity, description, picture })
                if (save) {
                    res.status(200).json({ status: 200, result: save });
                } else {
                    res.status(500).json({ status: 500, error: "Error during the save" })
                }
            } else {
                res.status(500).json({ status: 500, error: "This material exist" })
            }
        })
})

const addType = catchAsync(async(req, res) => {
    const name = req.body.name

    await Type.findOne({ name })
        .then(async response => {
            if (!response) {
                const save = await Type.create({ name })
                if (save) {
                    res.status(200).json({ status: 200, result: save });
                } else {
                    res.status(500).json({ status: 500, error: "Error during the save" })
                }
            } else {
                res.status(500).json({ status: 500, error: "This type exist" })
            }
        })
})

const updateMateriaux = catchAsync(async(req, res) => {
    const { id } = req.params
    const { name, type, prixUnit, quantity, description, picture } = req.body

    return Material.findBy(id)
        .then(resultFind => {
            if (resultFind) {
                return Material.findOne({ name })
                    .then(async response => {
                        if (!response) {
                            const save = await Material.findByIdAndUpdate(id, { name, type, prixUnit, quantity, description, picture })
                            if (save) {
                                res.status(200).json({ status: 200, result: save });
                            } else {
                                res.status(500).json({ status: 500, error: "Error during the update" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "This material exist" })
                        }
                    })
            } else {
                res.status(500).json({ status: 500, error: "This material don\'t exist" })
            }
        })
})

// const updateMateriauxPrise = catchAsync(async(req, res) => {
//     const { id } = req.params
//     const { prixUnit } = req.body

//     return Material.findBy(id)
//         .then(resultFind => {
//             if (resultFind) {
//                 return Material.findOne({ name })
//                     .then(response => {
//                         if (!response) {
//                             const save = await Material.findByIdAndUpdate(id, { prixUnit })
//                             if (save) {
//                                 res.status(200).json({ status: 200, result: save });
//                             } else {
//                                 res.status(500).json({ status: 500, error: "Error during the update  of price" })
//                             }
//                         } else {
//                             res.status(500).json({ status: 500, error: "This material exist" })
//                         }
//                     })
//             } else {
//                 res.status(500).json({ status: 500, error: "This material don\'t exist" })
//             }
//         })
// })

// const updateMateriauxPrise = catchAsync(async(req, res) => {
//     const { id } = req.params
//     const { prixUnit } = req.body

//     return Material.findBy(id)
//         .then(resultFind => {
//             if (resultFind) {
//                 return Material.findOne({ name })
//                     .then(response => {
//                         if (!response) {
//                             const save = await Material.findByIdAndUpdate(id, { name, type, prixUnit, quantity, description })
//                             if (save) {
//                                 res.status(200).json({ status: 200, result: save });
//                             } else {
//                                 res.status(500).json({ status: 500, error: "Error during the update  of price" })
//                             }
//                         } else {
//                             res.status(500).json({ status: 500, error: "This material exist" })
//                         }
//                     })
//             } else {
//                 res.status(500).json({ status: 500, error: "This material don\'t exist" })
//             }
//         })
// })

const getAllMateriaux = catchAsync(async(req, res) => {
    const page = (req.body.page) ? req.body.page : 1
    const limit = (req.body.limit) ? req.body.limit : 10
    return Material.paginate({}, { page, limit })
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
});

const getType = catchAsync(async(req, res) => {
    return Type.find()
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
});

const deleteType = catchAsync(async(req, res) => {
    const id = req.body.idType
    await Material.find({ type: id })
        .then(async materials => {
            if (materials > 0) {
                for (let i = 0; i < materials.length; i++) {
                    await Material.findByIdAndUpdate(materials[i]._id, { type: undefined })
                }
                await Type.findByIdAndDelete(id)
                    .then(response => {
                        res.status(200).json({ status: 200, result: response });
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ status: 500, error: "Error" })
                    })
            } else {
                await Type.findByIdAndDelete(id)
                    .then(response => {
                        res.status(200).json({ status: 200, result: response });
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ status: 500, error: "Error" })
                    })
            }
        })



});

const getOneMateriaux = catchAsync(async(req, res) => {
    const id = req.params.id
    return Material.findById(id)
        .then(response => {
            if (response) {
                res.status(200).json({ status: 200, result: response });
            } else {
                res.status(500).json({ status: 500, error: "This materiel don't exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
})

const getGetByType = catchAsync(async(req, res) => {
    const type = req.body.type
    const page = (req.body.page) ? req.body.page : 1
    const limit = (req.body.limit) ? req.body.limit : 10
    return Material.paginate({ type }, { page, limit })
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
})

const getGetByPrise = catchAsync(async(req, res) => {
    const page = (req.body.page) ? req.body.page : 1
    const limit = (req.body.limit) ? req.body.limit : 10
    return Material
        .sort({ prixUnit: -1 })
        .paginate({}, { page, limit })
        .then(response => {
            res.status(200).json({ status: 200, result: response });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ status: 500, error: "Error" })
        })
})

module.exports = {
    addMateriaux,
    updateMateriaux,
    getAllMateriaux,
    getGetByType,
    getGetByPrise,
    getOneMateriaux,
    addType,
    getType,
    deleteType,
}