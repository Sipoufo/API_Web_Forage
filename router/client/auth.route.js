const express = require('express');
const validate = require('../../middlewares/validate');
const { AuthValidationClient } = require('../../validation/index');
const { authControllerUser } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Client
 *  description: Part of API to manage the client
 */

//Admin Authentification
/**
 * @swagger
 *  /client/auth/register:
 *      post: 
 *          summary: Client register
 *          tags: [Client]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              birthday:
 *                                  type: string
 *                              phone:
 *                                  type: string
 *                              email:
 *                                  type: string
 *                              IdCompteur:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  minLength: 8
 *                              longitude:
 *                                  type: string
 *                              latitude:
 *                                  type: string
 *                              profileImage:
 *                                  type: string
 *                          example:
 *                              name: Sipoufo Yvan
 *                              birthday: 2002-01-29
 *                              phone: "695914926"
 *                              password: Azerty12
 *                              IdCompteur: 12A
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new client and return the information about it
 *                                    
 */
router
    .route('/register')
    .post(tokenVerifieAdmin, validate(AuthValidationClient.register), authControllerUser.register)

/**
 * @swagger
 * /client/auth/logout:
 *  get:
 *      summary: Admin logout
 *      tags: [Client]
 *      responses: 
 *          200:
 *              description: logout successfully
 *          400:
 *              description: Error during the logout
 */
router
    .route('/logout')
    .get(tokenVerifieAdmin, authControllerUser.logout)

module.exports = router