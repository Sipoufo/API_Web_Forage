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
const jwt = require('jsonwebtoken');

const tokenVerifieAdmin = (req, res, next) => {
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

module.exports = {
    tokenVerifieAdmin
};