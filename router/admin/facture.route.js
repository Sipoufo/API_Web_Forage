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
 *                              oldIndex:
 *                                  type: integer
 *                              consommation:
 *                                  type: integer
 *                              montantConsommation:
 *                                  type: integer
 *                              montantTotal:
 *                                  type: integer
 *                              dataLimitePaid:
 *                                  type: string
 *                              dateReleveOldIndex:
 *                                  type: string
 *                          example:
 *                              newIndex: 82
 *                              oldIndex: 50
 *                              consommation: 32
 *                              montantConsommation: 16000
 *                              montantTotal: 28000
 *                              dataLimitePaid: 2021-07-12
 *                              dateReleveOldIndex: 2021-06-02
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
 *                              oldIndex:
 *                                  type: integer
 *                              consommation:
 *                                  type: integer
 *                              prixUnitaire:
 *                                  type: integer
 *                              montantConsommation:
 *                                  type: integer
 *                              fraisEntretien:
 *                                  type: integer
 *                              montantTotal:
 *                                  type: integer
 *                              dataLimitePaid:
 *                                  type: string
 *                              dateReleveOldIndex:
 *                                  type: string
 *                          example:
 *                              newIndex: 82
 *                              oldIndex: 50
 *                              consommation: 32
 *                              prixUnitaire: 500
 *                              montantConsommation: 16000
 *                              fraisEntretien: 1000
 *                              montantTotal: 28000
 *                              dataLimitePaid: 2021-07-12
 *                              dateReleveOldIndex: 2021-06-02
 *          responses:
 *              '201':
 *                  description: >
 *                      update a facture
 *                                    
 */
router
    .route('/:idFacture')
    .put(tokenVerifieAdmin, validate(FactureValidation.updateFacture), FactureController.updateFacture)

/**
 * @swagger
 *  /admin/facture/{idFacture}:
 *      put: 
 *          summary: Add facture
 *          tags: [Facture_Admin]
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
 *                      get factures
 *                                    
 */
router
    .route('/')
    .put(tokenVerifieAdmin, validate(FactureValidation.getWithStatus), FactureController.getWithStatus)

/**
 * @swagger
 *  /admin/facture/{idFacture}:
 *      get:
 *          summary: get all facture
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
 */
router
    .route('/:idFacture')
    .get(tokenVerifieAdmin, FactureController.getFacture)


module.exports = router