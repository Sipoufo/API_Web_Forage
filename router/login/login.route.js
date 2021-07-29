const express = require('express');
const validate = require('../../middlewares/validate');
const { LoginValidation } = require('../../validation/index');
const { loginController } = require('../../controller/index');
const { tokenVerifie } = require('../../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: login
 *  description: Part of API to manage the admin
 */

/**
 * @swagger
 *  /login:
 *      post: 
 *          summary: Admin connection
 *          tags: [login]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              phone:
 *                                  type: string
 *                              password:
 *                                  type: String
 *                          example:
 *                              phone: "695914926"
 *                              password: Azerty12
 *          responses:
 *              '201':
 *                  description: >
 *                      return all the information of user login
 *                      Successfully authenticated.
 *                      The session ID is returned in a cookie name 'jwt'
 */
router
    .route('/')
    .post(validate(LoginValidation.login), loginController.login)

/**
 * @swagger
 *  /login/localisation:
 *      post: 
 *          summary: Admin connection
 *          tags: [login]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              longitude:
 *                                  type: number
 *                              latitude:
 *                                  type: number
 *                          example:
 *                              longitude: 12
 *                              latitude: 12
 *          responses:
 *              '201':
 *                  description: >
 *                      return all the information of user login
 *                      Successfully authenticated.
 */
router
    .route('/localisation')
    .post(tokenVerifie, validate(LoginValidation.localisation), loginController.localisation)
module.exports = router