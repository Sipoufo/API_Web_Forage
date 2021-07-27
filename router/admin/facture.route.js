const express = require('express');
const validate = require('../../middlewares/validate');
const { FactureValidation } = require('../../validation/index');
const { FactureController } = require('../../controller/index');
const { tokenVerifieAdmin, tokenVerifie } = require('../../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Facture_Admin
 *  description: Part of API to manage the factures
 */


/**
 * @swagger
 *  /admin/facture:
 *      get:
 *          summary: All facture
 *          tags: [Facture_Admin]
 *          responses:
 *              200:
 *                  description: return all the facture
 *              500:
 *                  description: Error while the get all the facture
 */
router
    .route('/')
    .get(tokenVerifieAdmin, FactureController.getFactures)


//  get all facture advance
/**
 * @swagger
 *  /admin/facture/getFactureAd:
 *      get:
 *          summary: get all facture advance
 *          tags: [Facture_Admin]
 *          responses: 
 *              200:
 *                  description: get advance facture save in the bd
 *              500:
 *                  description: Error during the get
 */
router
    .route('/getFactureAd')
    .get(tokenVerifieAdmin, FactureController.getFactureAdvance)


// all facture by status
/**
 * @swagger
 *  /admin/facture/getByStatus:
 *      get:
 *          summary: get all facture advance
 *          tags: [Facture_Admin]
 *          responses: 
 *              200:
 *                  description: get advance facture save in the bd
 *              500:
 *                  description: Error during the get
 */
router
    .route('/getByStatus')
    .get(tokenVerifieAdmin, validate(FactureValidation.getByStatus), FactureController.getByStatus)

/**
 * @swagger
 *  /admin/facture/{idClient}:
 *      post: 
 *          summary: Add facture
 *          tags: [Facture_Admin]
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
 *                              newIndex:
 *                                  type: integer
 *                              observation:
 *                                  type: string
 *                              penalite:
 *                                  type: integer
 *                              dataPaid:
 *                                  type: string
 *                              montantVerse:
 *                                  type: integer
 *                              dateReleveNewIndex:
 *                                  type: string
 *                              oldIndex:
 *                                  type: integer
 *                          example:
 *                              newIndex: 150
 *                              observation: 'Bon client'
 *                              penalite: 0
 *                              dataPaid: 2021-07-30
 *                              montantVerse: 2000
 *                              dateReleveNewIndex: 2021-07-12
 *                              oldIndex: 100
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *      get:
 *          summary: get all facture of one client
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of user
 *          responses: 
 *              200:
 *                  description: get all factures save in the bd
 *              500:
 *                  description: Error during the get                                    
 */
router
    .route('/:idClient')
    .post(tokenVerifieAdmin, validate(FactureValidation.addFacture), FactureController.addFacture)
    .get(tokenVerifieAdmin, validate(FactureValidation.getClientFactures), FactureController.getClientFactures)

/**
 * @swagger
 *  /admin/facture/statusPaidFacture/{idFacture}:
 *      put: 
 *          summary: Add facture
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: idFacture
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of facture
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: boolean
 *                          example:
 *                              status: true
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/statusPaidFacture/:idFacture')
    .put(tokenVerifie, validate(FactureValidation.statusPaidFacture), FactureController.statusPaidFacture)

/**
 * @swagger
 *  /admin/facture/{idFacture}:
 *      put: 
 *          summary: Add facture
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: idFacture
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of facture
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              newIndex:
 *                                  type: integer
 *                              observation:
 *                                  type: integer
 *                              penalite:
 *                                  type: integer
 *                              montantVerse:
 *                                  type: integer
 *                              dateReleveNewIndex:
 *                                  type: integer
 *                          example:
 *                              newIndex: 140
 *                              observation: 'Il derange parfois'
 *                              penalite: 500
 *                              montantVerse: 2500
 *                              dateReleveNewIndex: 2021-07-13
 *          responses:
 *              '201':
 *                  description: >
 *                      update a facture
 * 
 *      get:
 *          summary: get one facture
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: idFacture
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of facture
 *          responses: 
 *              200:
 *                  description: get on facture save in the bd
 *              500:
 *                  description: Error during the get
 *                                    
 */
router
    .route('/:idFacture')
    .get(tokenVerifieAdmin, FactureController.getFacture)
    .put(tokenVerifieAdmin, validate(FactureValidation.updateFacture), FactureController.updateFacture)


module.exports = router