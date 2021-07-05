const express = require('express');
const validate = require('../../middlewares/validate');
const { AuthValidationClient } = require('../../validation/index');
const { authControllerUser } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

router
    .route('/register')
    .post(validate(AuthValidationClient.register), authControllerUser.register)

// router
//     .route('/login')
//     .get(validate(AuthValidationClient.login), authControllerUser.login)

router
    .route('/logout')
    .get(tokenVerifieAdmin, authControllerUser.logout)

module.exports = router