const express = require('express');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../validation/index');
const { authAdmin } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Admin
 *  description: Part of API to manage the admin
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
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/register')
    .post(tokenVerifieAdmin, validate(adminAuth.register), authAdmin.register)

/**
 * @swagger
 * /admin/auth/logout:
 *  get:
 *      summary: Admin logout
 *      tags: [Admin]
 *      responses: 
 *          200:
 *              description: logout successfully
 *          500:
 *              description: Error during the logout
 */
router
    .route('/logout')
    .get(tokenVerifieAdmin, authAdmin.logout)

/**
 * @swagger
 * /admin/auth/getClient:
 *  get:
 *      summary: get all user
 *      tags: [Admin]
 *      responses: 
 *          200:
 *              description: get all user in the bd
 *          500:
 *              description: Error during the get
 */
router
    .route('/getClient')
    .get(tokenVerifieAdmin, authAdmin.getClients)


/**
 * @swagger
 * /admin/auth/getAdmin:
 *  get:
 *      summary: get all admin
 *      tags: [Admin]
 *      responses: 
 *          200:
 *              description: get all admin in the bd
 *          500:
 *              description: Error during the get
 */
router
    .route('/getClient')
    .get(tokenVerifieAdmin, authAdmin.getAdmins)

router
    .route('/send/first/admin')
    .get(authAdmin.sendFirstAdmin)

module.exports = router