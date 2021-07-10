/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-return-await */
/* eslint-disable no-shadow */
/* eslint-disable no-useless-return */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken')
const { Admin, Client } = require('../models/index')

const tokenVerifie = (req, res, next) => {
    const token = req.cookies.pwftoken;

    // Check if the token exist
    if (token) {
        jwt.verify(token, 'Admin web forage', (err, decodedToken) => {
            // Verified token
            if (err) {
                console.log(err)
                res.status(401).json({ status: httpStatus.UNAUTHORIZED, error: "Please login" })
            } else {
                console.log(decodedToken);
                next()
            }
        })
    } else {
        res.status(401).json({ status: httpStatus.UNAUTHORIZED, error: "Please login" })
    }
}

const tokenVerifieAdmin = (req, res, next) => {
    const token = req.cookies.pwftoken;

    // Check if the token exist
    if (token) {
        jwt.verify(token, 'Admin web forage', (err, decodedToken) => {
            // Verified token
            if (err) {
                console.log(err)
                res.status(500).json({ status: 500, error: "Please login" })
            } else {
                Admin.findById(decodedToken.id)
                    .then(admin => {
                        if (admin) {
                            next()
                        } else {
                            res.status(500).json({ status: 500, error: "You are not admin" })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ status: 500, error: err })
                    })
            }
        })
    } else {
        res.status(500).json({ status: 500, error: "Please login" })
    }
}

const tokenVerifieClient = (req, res, next) => {
    const token = req.cookies.pwftoken;

    // Check if the token exist
    if (token) {
        jwt.verify(token, 'Admin web forage', (err, decodedToken) => {
            // Verified token
            if (err) {
                console.log(err)
                res.status(500).json({ status: 500, error: "Please login" })
            } else {
                console.log(decodedToken);
                Client.findById(decodedToken.id)
                    .then(client => {
                        if (client) {
                            next()
                        } else {
                            res.status(500).json({ status: 500, error: "You are not client" })
                        }
                    })
            }
        })
    } else {
        res.status(500).json({ status: 500, error: "Please login" })
    }
}

module.exports = {
    tokenVerifie,
    tokenVerifieAdmin,
    tokenVerifieClient,
};