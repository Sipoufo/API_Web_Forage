// const httpStatus = require('http-status');
// const ApiError = require('../../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Admin, Client } = require('../models/index')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const maxAge = 3 * 24 * 60 * 60

const authorization = (req) => {
    return req.headers.authorization.split(" ")[1]
}

const createToken = (id) => {
    return jwt.sign({ id }, 'Admin web forage', {
        expiresIn: maxAge
    })
}

const createTokenForgetPassword = (id) => {
    return jwt.sign({ id }, 'Forget forage password', {
        expiresIn: (30 * 60)
    })
}

const login = catchAsync(async(req, res) => {
    const phone = req.body.phone
    const password = req.body.password

    return Admin.findOne({ phone })
        .then(async admin => {
            if (admin) {
                const resultAdmin = await admin.isPasswordMatch(password)
                console.log(admin._id);
                if (resultAdmin) {
                    const token = createToken(admin._id)
                    res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                    res.status(200).json({ status: 200, result: admin })
                } else {
                    res.status(500).json({ status: 500, error: "Phone/Password Error" })
                }
            } else {
                // res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                return Client.findOne({ phone })
                    .then(async(client) => {
                        if (client) {
                            const result = await client.isPasswordMatch(password)
                            if (result) {
                                const token = createToken(client._id)
                                res.cookie('pwftoken', token, { httpOnly: true, maxAge: maxAge * 1000 })
                                res.status(200).json({ status: 200, result: client })
                            } else {
                                res.status(500).json({ status: 500, error: "Phone/Password Error" })
                            }
                        } else {
                            res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

const localisation = catchAsync(async(req, res) => {
    const id = req.params.id
    const longitude = req.body.longitude
    const latitude = req.body.latitude
    const description = req.body.description
    return Admin.findById(id)
        .then(admin => {
            if (admin) {
                return Admin.findByIdAndUpdate(id, { localisation: { longitude, latitude, description: admin.localisation.description } })
                    .then(resp => {
                        res.status(200).json({ status: 200, result: resp })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                return Client.findById(id)
                    .then(client => {
                        if (client) {
                            return Client.findByIdAndUpdate(id, { localisation: { longitude, latitude, description: description } })
                                .then(response => {
                                    res.status(200).json({ status: 200, result: response })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        } else {
                            res.status(500).json({ status: 500, error: "Your are not register <0_0>" })
                        }
                    })
            }
        })
})

// const forgetByEmail = () => {

// }

// const forgetPassword = catchAsync(async(res, req) => {
//     var result = undefined;
//     if (req.body.email || req.body.phone){
//         result = req.body.email ? req.body.email: req.body.phone;
//         await Admin.findOne({ result })
//         .then(async(resultFind) => {
//             if (resultFind) {

//             } else {
//                 await Client.findOne({ result })
//                     .then(async(resultFind) => {
//                         if (resultFind) {

//                         } else {
//                             res.status(500).json({ status: 500, error: "Your are not register" })
//                         }
//                     })
//             }
//         })
//     } else {
//         res.status(500).json({ status: 500, error: "Your are not register" })
//     }
// })

const forgotPassword = catchAsync(async(req, res) => {
    phone = req.body.phone
    const admin = await Admin.findOne({profile: "superAdmin"})
    Client.findOne({phone})
        .then(async customer => {
            if (customer) {
                let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                      user: testAccount.user, // generated ethereal user
                      pass: testAccount.pass, // generated ethereal password
                    },
                });
                let info = await transporter.sendMail({
                    from: '"WEB FORAGE" <'+admin.email+'>', // sender address
                    to: "sipoufoknj@gmail.com", // list of receivers
                    subject: "Forgot Password : "+customer.name, // Subject line
                    text: "This user have forgot it password", // plain text body
                    html: "", // html body
                });
            } else {
                res.status(500).json({ status: 500, error: "You are not register"})
            }
        })
})

const changePassword = async(user, data, newPassword, res) => {
    await user.findByIdAndUpdate(data.id, { password: newPassword})
        .then(result => {
            console.log(result)
            if (result) {
                res.status(200).json({ status: 200, result });
            } else {
                res.status(500).json({ status: 500, error:"Error please retry" });
            }
        })
}

const passwordUserReset = catchAsync(async(req, res) => {
    let newPassword = req.body.newPassword;
    const phone = req.body.phone;
    console.log(newPassword)
    newPassword = await bcrypt.hash(newPassword, 8);

    return Admin.findOne({phone})
        .then(async(admin) => {
            if (admin) {
                await changePassword(Admin, admin, newPassword, res)
            } else {
                return Client.findOne({phone})
                    .then(async (customer) => {
                        if(customer) {
                            await changePassword(Client, customer, newPassword, res)
                        } else {
                            res.status(500).json({ status: 500, error:"You are not register!" });
                        }
                    })
            }
        })
})

const userName = catchAsync(async (req, res) => {
    const phone = req.params.phone;
    
    await Admin.findOne({phone})
        .then( async admin => {
            if (admin) {
                res.status(200).json({ status: 200, result: admin.name })
            } else {
                await Client.findOne({phone})
                    .then(customer => {
                        if (customer) {
                            res.status(200).json({ status: 200, result: customer.name  })
                        } else {
                            res.status(500).json({ status: 500, error:"You are not register!" });
                        }
                    })
            }
        })
})


module.exports = {
    login,
    localisation,
    forgotPassword,
    passwordUserReset,
    userName,
}