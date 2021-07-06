const express = require('express');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../validation/index');
const { authAdmin } = require('../../controller/index');
const { login } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Admin
 *  description: Part of API to manage the annonceur
 */

//Admin Authentification
/**
 * @swagger
 *  /admin/auth/register:
 *      post: 
 *          summary: Admin register
 *          tags: [Admin]
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
 *                              password:
 *                                  type: string
 *                                  format: password
 *                                  minLength: 8
 *                              longitude:
 *                                  type: string
 *                              latitude:
 *                                  type: string
 *                          example:
 *                              name: Sipoufo Yvan
 *                              birthday: 2002-01-29
 *                              phone: "695914926"
 *                              password: Azerty12
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *          security: []
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new annonceur and return the information about it
 *                                    
 */
router
    .route('/register')
    .post(validate(adminAuth.register), authAdmin.register)

/**
 * @swagger
 *  /admin/auth/login:
 *      get: 
 *          summary: Admin connection
 *          tags: [Admin]
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
 *          security: []
 *          responses:
 *              '201':
 *                  description: >
 *                      return all the information of user login
 *                      Successfully authenticated.
 *                      The session ID is returned in a cookie name 'jwt'
 */
router
    .route('/login')
    .get(validate(adminAuth.login), login.login)

/**
 * @swagger
 * /admin/auth/logout:
 *  get:
 *      summary: Admin logout
 *      tags: [Admin]
 *      responses: 
 *          200:
 *              description: logout successfully
 *          400:
 *              description: Error during the logout
 */
router
    .route('/logout')
    .get(tokenVerifieAdmin, authAdmin.logout)

module.exports = router