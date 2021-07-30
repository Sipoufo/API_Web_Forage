const express = require('express');
const validate = require('../../middlewares/validate');
const { AuthValidationClient } = require('../../validation/index');
const { authControllerUser } = require('../../controller/index');
const { tokenVerifieAdmin, tokenVerifieClient, tokenVerifie } = require('../../middlewares/auth');

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
 *                              description:
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
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new client and return the information about it
 *                                    
 */
router
    .route('/register')
    .post(tokenVerifieAdmin, validate(AuthValidationClient.register), authControllerUser.register);

/**
 * @swagger
 *  /client/auth/update:
 *      put: 
 *          summary: Client update
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
 *                              idCompteur:
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
 *                              description:
 *                                  type: string
 *                          example:
 *                              name: Sipoufo Yvan
 *                              birthday: 2002-01-29
 *                              phone: "695914926"
 *                              password: Azerty12
 *                              idCompteur: UX2024
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new client and return the information about it
 *                                    
 */
router
    .route('/update')
    .put(tokenVerifieClient, validate(AuthValidationClient.update), authControllerUser.update);

// get one
/**
 * @swagger
 * /client/auth/{idClient}:
 *  get:
 *      summary: get one client
 *      tags: [Admin]
 *      parameters:
 *          -   in: path
 *              name: idClient
 *              schema: 
 *                  type: string
 *              required: true
 *              description: The id of client
 *      responses: 
 *          200:
 *              description: get successfully
 *          500:
 *              description: Error
 */
router
    .route('/:idClient')
    .get(tokenVerifie, validate(AuthValidationClient.getOne), authControllerUser.getOneClient);

// Update By ID
/**
 * @swagger
 *  /client/auth/update/{idClient}:
 *      put: 
 *          summary: Client update by ID
 *          tags: [Client]
 *          parameters:
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of client
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
 *                              description:
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
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new client and return the information about it
 *                                    
 */
router
    .route('/update/:idClient')
    .put(tokenVerifieAdmin, validate(AuthValidationClient.updateById), authControllerUser.updateById);

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
    .get(tokenVerifieAdmin, authControllerUser.logout);

/**
 * @swagger
 * /client/auth/getClientByToken:
 *  get:
 *      summary: get one client
 *      tags: [Client]
 *      responses: 
 *          200:
 *              description: get successfully
 *          400:
 *              description: Error during the logout
 */
router
    .route('/getClientByToken')
    .get(tokenVerifieAdmin, authControllerUser.getAdminByToken);

module.exports = router