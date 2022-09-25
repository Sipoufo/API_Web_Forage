const express = require('express');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../validation/index');
const { authAdmin } = require('../../controller/index');
const { tokenVerifieAdmin, tokenVerifie } = require('../../middlewares/auth');

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
 *                              profileImage:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                          example:
 *                              name: Sipoufo Yvan
 *                              birthday: 2002-01-29
 *                              phone: "695914926"
 *                              password: Azerty12
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/register')
    .post(tokenVerifieAdmin, validate(adminAuth.register), authAdmin.register);

/**
 * @swagger
 *  /admin/auth/update:
 *      put: 
 *          summary: Admin update
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
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/update')
    .put(tokenVerifieAdmin, validate(adminAuth.update), authAdmin.update);

// Update with ID
/**
 * @swagger
 *  /admin/auth/update/{idAdmin}:
 *      put: 
 *          summary: Admin update with ID
 *          tags: [Admin]
 *          parameters:
 *              -   in: path
 *                  name: idAdmin
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of Admin
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
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *                              description: Bafoussam TPO
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/update/:idAdmin')
    .put(tokenVerifieAdmin, validate(adminAuth.updateById), authAdmin.updateById);



// Update password
/**
 * @swagger
 *  /admin/auth/updatePassword:
 *      put: 
 *          summary: Admin update with ID
 *          tags: [Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              newPassword:
 *                                  type: string
 *                              oldPassword:
 *                                  type: string
 *                          example:
 *                              newPassword: Azerty12
 *                              oldPassword: Azerty12
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/updatePassword')
    .put(tokenVerifieAdmin, validate(adminAuth.updatePassword), authAdmin.updatePassword);



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

//  logout
router
    .route('/logout')
    .get(tokenVerifieAdmin, authAdmin.logout);


// get clients
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
    .get(tokenVerifieAdmin, authAdmin.getClients);

// get clients by subscription date
/**
 * @swagger
 * /admin/auth/client/findBySubscriptionDate/{subscriptionDate}:
 *  get:
 *      summary: get all user by subscription date
 *      tags: [Admin]
 *      parameters:
 *              -   in: path
 *                  name: subscriptionDate
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: date went user has received abonment
 *      responses: 
 *          200:
 *              description: get all user in the bd
 *          500:
 *              description: Error during the get
 */
 router
 .route('/client/findBySubscriptionDate/:subscriptionDate')
 .get(tokenVerifieAdmin, validate(adminAuth.getClientBySubsDate), authAdmin.getClientsBySuscriptionDate);

 // get clients by subscription date
/**
 * @swagger
 * /admin/auth/client/find/{page}/{limit}:
 *      parameters:
 *              -   in: path
 *                  name: limit
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: limit where you want on one page
 *              -   in: path
 *                  name: page
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: Page where you want to be
 *      post:
 *          summary: find user in the bd by constraint
 *          tags: [Admin]
 *          requestBody:
 *                  required: true
 *                  content:
 *                      application/json:  
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  date:
 *                                      type: string
 *                                  refId:
 *                                      type: integer
 *                                  counterId:
 *                                      type: string
 *                                  order:
 *                                      type: string
 *                                      enum: [asc, desc]
 *                              example:
 *                                  date: "2022-01-26"
 *                                  order: desc
 *                                  counterId: "778fs"
 *                                  refId: 15
 *          responses: 
 *              200:
 *                  description: > 
 *                      get all user in the bd
 * 
 */
 router
 .route('/client/find/:page/:limit')
 .post(tokenVerifieAdmin, validate(adminAuth.findClient), authAdmin.findClient);

// get clients
/**
 * @swagger
 * /admin/auth/client/{page}/{limit}:
 *  get:
 *      summary: get all user with pagination
 *      tags: [Admin]
 *      parameters:
 *              -   in: path
 *                  name: limit
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: limit where you want on one page
 *              -   in: path
 *                  name: page
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: Page where you want to be
 *      responses: 
 *          200:
 *              description: get all user in the bd
 *          500:
 *              description: Error during the get
 */
 router
    .route('/client/:page/:limit')
    .get(tokenVerifieAdmin, validate(adminAuth.getClients), authAdmin.getClientsWithPagination);

// get client by authorization
/**
 * @swagger
 * /admin/auth/getAdminByToken:
 *  get:
 *      summary: get one admin
 *      tags: [Admin]
 *      responses: 
 *          200:
 *              description: get all user in the bd
 *          500:
 *              description: Error during the get
 */
router
    .route('/getAdminByToken')
    .get(tokenVerifieAdmin, authAdmin.getAdminByToken);


// get Admin
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
    .route('/getAdmin')
    .get(tokenVerifieAdmin, authAdmin.getAdmins);


//get one
/**
 * @swagger
 * /admin/auth/{idAdmin}:
 *  get:
 *      summary: get one admin
 *      tags: [Admin]
 *      parameters:
 *          -   in: path
 *              name: idAdmin
 *              schema: 
 *                  type: string
 *              required: true
 *              description: The id of Admin
 *      responses: 
 *          200:
 *              description: get successfully
 *          500:
 *              description: Error
 */
router
    .route('/:idAdmin')
    .get(tokenVerifie, validate(adminAuth.getAdmin), authAdmin.getOneAdmin);

// first Admin
router
    .route('/send/first/admin')
    .get(authAdmin.sendFirstAdmin);

module.exports = router