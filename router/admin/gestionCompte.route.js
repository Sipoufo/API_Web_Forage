const express = require('express');
const validate = require('../../middlewares/validate');
const { gestionCompteValidation } = require('../../validation/index');
const { gestionCompteController } = require('../../controller/index');
const { tokenVerifieAdmin, tokenVerifie } = require('../../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Manage_compte
 *  description: Part of API to manage the user and admin compte
 */

// Delete Client
/**
 * @swagger
 *  /admin/manageCompte/client/delete/{idClient}:
 *      put: 
 *          summary: delete facture
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              isDelete:
 *                                  type: boolean
 *                          example:
 *                              isDelete: true
 *          responses:
 *              '201':
 *                  description: >
 *                      get factures
 */
router
    .route('/client/delete/:idClient')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.deleteCompteClient), gestionCompteController.deleteCompteClient)

// Block client
/**
 * @swagger
 *  /admin/manageCompte/client/block/{idClient}:
 *      put: 
 *          summary: delete facture
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              isBlock:
 *                                  type: boolean
 *                          example:
 *                              isBlock: true
 *          responses:
 *              '201':
 *                  description: >
 *                      get client
 */
router
    .route('/client/block/:idClient')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.blockCompteClient), gestionCompteController.BlockCompteClient)

// Delete admin
/**
 * @swagger
 *  /admin/manageCompte/admin/delete/{idAdmin}:
 *      put: 
 *          summary: delete facture
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idAdmin
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of admin
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              isDelete:
 *                                  type: boolean
 *                          example:
 *                              isDelete: true
 *          responses:
 *              '201':
 *                  description: >
 *                      get factures
 */
router
    .route('/admin/delete/:idAdmin')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.deleteCompteAdmin), gestionCompteController.deleteCompteAdmin)

// Block admin
/**
 * @swagger
 *  /admin/manageCompte/client/idCompte/{idAdmin}:
 *      put: 
 *          summary: update id compteur facture
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idAdmin
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of admin
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              IdCompteur:
 *                                  type: string
 *                          example:
 *                              IdCompteur: UX2024
 *          responses:
 *              '201':
 *                  description: >
 *                      get one Client
 */
router
    .route('/admin/block/:idAdmin')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.blockCompteAdmin), gestionCompteController.BlockCompteAdmin)


// compte Client
/**
 * @swagger
 *  /admin/manageCompte/admin/block/{idAdmin}:
 *      put: 
 *          summary: delete facture
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idAdmin
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of admin
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              isBlock:
 *                                  type: boolean
 *                          example:
 *                              isBlock: true
 *          responses:
 *              '201':
 *                  description: >
 *                      get factures
 */
router
    .route('/admin/block/:idAdmin')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.blockCompteAdmin), gestionCompteController.BlockCompteAdmin)

// Update admin
/**
 * @swagger
 *  /admin/manageCompte/admin/update/{idAdmin}:
 *      put: 
 *          summary: update admin by the super administrator
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: idAdmin
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of admin
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
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/admin/update/:idAdmin')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.updateAdmin), gestionCompteController.updateAdmin)


// Update password
/**
 * @swagger
 *  /admin/manageCompte/updatePassord/{id}:
 *      put: 
 *          summary: Admin update with ID
 *          tags: [Manage_compte]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of client or administrateur
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              password:
 *                                  type: string
 *                          example:
 *                              password: Azerty12
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/updatePassword/:id')
    .put(tokenVerifie, validate(gestionCompteValidation.updatePassword), gestionCompteController.updatePassword);

    

// Update client
/**
 * @swagger
 *  /admin/manageCompte/client/update/{idClient}:
 *      put: 
 *          summary: update client by the super administrator
 *          tags: [Manage_compte]
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
 *                              IdCompteur:
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
 *                              IdCompteur: UX2024
 *                              email: sipoufoTest@gmail.com
 *                              longitude: 12
 *                              latitude: 12
 *                              profileImage: /test/test.png
 *                              description: Bafoussam TPO
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/client/update/:idClient')
    .put(tokenVerifieAdmin, validate(gestionCompteValidation.updateClient), gestionCompteController.updateClient)


module.exports = router