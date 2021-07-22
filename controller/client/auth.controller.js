const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Client = require('../../models/client.model')
const Admin = require('../../models/administrateur.model')
const jwt = require('jsonwebtoken')

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const register = catchAsync(async(req, res) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const description = req.body.description
    const IdCompteur = req.body.IdCompteur
    const password = req.body.password
    const profileImage = req.body.profileImage
    const longitude = (req.body.longitude) ? req.body.longitude : undefined
    const latitude = (req.body.latitude) ? req.body.longitude : undefined


    return Admin.findOne({ phone })
        .then(admin => {
            if (!admin) {
                return Client.findOne({ phone })
                    .then(number => {
                        if (!number) {
                            return Client.findOne({ email })
                                .then(async(mail) => {
                                    if (!mail) {
                                        const result = await Client.create({ name, phone, IdCompteur, profileImage, email, birthday, password, localisation: { longitude, latitude, description } })
                                        if (result) {
                                            res.status(200).json({ status: 200, result: result })
                                        } else {
                                            res.status(500).json({ status: 500, error: "Error during the save" })
                                        }
                                    } else {
                                        res.status(500).json({ status: 500, error: "this email exist <-_->" })
                                    }

                                })
                        } else {
                            console.log()
                            res.status(500).json({ status: 500, error: "this number exist <-_->" })
                        }
                    })
            } else {
                res.status(500).json({ status: 500, error: "This phone existe" })
            }
        })

})

const update = catchAsync(async(req, res) => {
    const token = authorization(req)
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const password = req.body.password
    const description = req.body.description
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    jwt.verify(token, 'Admin web forage', async(err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            return Admin.findOne({ phone })
                .then(async admin => {
                    if (!admin) {
                        const number = await Client.findOne({ phone });
                        if ((number && number._id == decodedToken.id) || !number) {
                            const emailAdmin = await Admin.findOne({ email });
                            const emailClient = await Client.findOne({ email });
                            if (!emailAdmin && !emailClient) {
                                const result = await Client.findByIdAndUpdate(decodedToken.id, { name, phone: phone, profileImage, email, birthday, password, localisation: { longitude, latitude, description } });
                                if (result) {
                                    res.status(200).json({ status: 200, result: result });
                                } else {
                                    res.status(500).json({ status: 500, error: "Error during the save" });
                                }
                            } else {
                                res.status(500).json({ status: 500, error: "This email don't exist" });
                            }

                        } else {
                            console.log();
                            res.status(500).json({ status: 500, error: "this number exist <-_->" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "One Client have this phone" })
                    }
                })
        }
    })
})

const updateById = catchAsync(async(req, res) => {
    const idClient = req.params.idClient
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const birthday = req.body.birthday
    const password = req.body.password
    const description = req.body.description
    const IdCompteur = req.body.IdCompteur
    const profileImage = req.body.profileImage
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    return Admin.findOne({ phone })
        .then(async admin => {
            if (!admin) {
                const number = await Client.findOne({ phone });
                if ((number && number._id == idClient) || !number) {
                    const emailAdmin = await Admin.findOne({ email });
                    const emailClient = await Client.findOne({ email });
                    if (!emailAdmin && !emailClient) {
                        const result = await Client.findByIdAndUpdate(idClient, { name, IdCompteur, phone: phone, profileImage, email, birthday, password, localisation: { longitude, latitude, description } });
                        if (result) {
                            res.status(200).json({ status: 200, result: result });
                        } else {
                            res.status(500).json({ status: 500, error: "Error during the save" });
                        }
                    } else {
                        res.status(500).json({ status: 500, error: "This email don't exist" });
                    }

                } else {
                    console.log();
                    res.status(500).json({ status: 500, error: "this number exist <-_->" });
                }
            } else {
                res.status(500).json({ status: 500, error: "One Client have this phone" })
            }
        })
})

// const login = catchAsync(async(req, res) => {
//     const phone = req.query.phone
//     const password = req.query.password
//     console.log(req)
//     return Client.findOne({ phone })
//         .then(async admin => {
//             if (admin) {
//                 console.log(admin);
//                 const result = await Client.isPasswordMatch(password)
//                 console.log(result);
//                 if (result) {
//                     const token = createToken(result._id)
//                     res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
//                     res.status(200).json({ status: 200, result: admin })
//                 } else {
//                     res.status(500).json({ status: 500, error: "Phone/Password Error" })
//                 }
//             } else {
//                 res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
//             }
//         })
// })

const logout = (req, res) => {
    res.cookie('pwftoken', '', { maxAge: 1 })
    res.status(200).json({ status: 200, result: "You are log out" })
}

module.exports = {
    register,
    logout,
    update,
    updateById
}