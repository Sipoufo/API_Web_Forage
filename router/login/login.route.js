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
 *                              password: ef773dcfc029bb1c25e48dbbe188372b
 *          responses:
 *              '201':
 *                  description: >
 *                      return all the information of user login
 *                      Successfully authenticated.
 *                      The session ID is returned in a cookie name 'jwt'
 */
router
    .route('/')
    .post(validate(LoginValidation.login), loginController.login);

/**
 * @swagger
 *  /login/localisation/id:
 *      post: 
 *          summary: Admin connection
 *          tags: [login]
 *          parameters:
 *              -   in: path
 *                  name: id
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
 *                              longitude:
 *                                  type: number
 *                              latitude:
 *                                  type: number
 *                              description:
 *                                  type: number
 *                          example:
 *                              longitude: 12
 *                              latitude: 12
 *                              description: test
 *          responses:
 *              '201':
 *                  description: >
 *                      return all the information of user login
 *                      Successfully authenticated.
 */
router
    .route('/localisation/:id')
    .post(tokenVerifie, validate(LoginValidation.localisation), loginController.localisation);


/**
 * @swagger
 *  /login/forgotPassword:
 *      post: 
 *          summary: Forgot password
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
 *                          example:
 *                              phone: "695914926"
 *          responses:
 *              '201':
 *                  description: >
 *                      Get a mail for admin
 */
router
    .route('/forgotPassword')
    .post(loginController.forgotPassword)


/**
 * @swagger
 *  /login/passwordUserReset:
 *      post: 
 *          summary: Forgot password
 *          tags: [login]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              phone:
 *                                  type: integer
 *                              newPassword:
 *                                  type: string
 *                          example:
 *                              phone: 695914926
 *                              newPassword: "ef773dcfc029bb1c25e48dbbe188372b"
 *          responses:
 *              '201':
 *                  description: >
 *                      Get a mail for admin
 */
router
    .route('/passwordUserReset')
    .post(loginController.passwordUserReset)


/**
 * @swagger
 *  /login/userInfo/{phone}:
 *      post: 
 *          summary: Forgot password
 *          tags: [login]
 *          parameters:
 *              -   in: path
 *                  name: phone
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: Phone number
 *          responses:
 *              '201':
 *                  description: >
 *                      Get a name for admin
 */
router
    .route('/userInfo/:phone')
    .get(loginController.userName)

module.exports = router