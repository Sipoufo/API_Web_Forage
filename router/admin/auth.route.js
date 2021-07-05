const express = require('express');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../validation/index');
const { authAdmin } = require('../../controller/index');
const { login } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

router
    .route('/register')
    .post(validate(adminAuth.register), authAdmin.register)

router
    .route('/login')
    .get(validate(adminAuth.login), login.login)

router
    .route('/logout')
    .get(tokenVerifieAdmin, authAdmin.logout)

module.exports = router