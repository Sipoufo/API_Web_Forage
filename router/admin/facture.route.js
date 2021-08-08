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
 *  /admin/facture/{year}/{month}/{limit}/{page}:
 *      get:
 *          summary: All facture
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: year
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: Year
 *              -   in: path
 *                  name: month
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: Month
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
 *          responses:
 *              200:
 *                  description: return all the facture
 *              500:
 *                  description: Error while the get all the facture
 */
router
    .route('/:year/:month/:limit/:page')
    .get(tokenVerifieAdmin, validate(FactureValidation.getFactures), FactureController.getFactures);


//  get all facture advance
/**
 * @swagger
 *  /admin/facture/:
 *      get:
 *          summary: get all facture without params
 *          tags: [Facture_Admin]
 *          responses: 
 *              200:
 *                  description: get advance facture save in the bd
 *              500:
 *                  description: Error during the get
 */
router
    .route('/')
    .get(tokenVerifieAdmin, FactureController.getAllFacture);



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
    .get(tokenVerifieAdmin, FactureController.getFactureAdvance);


// all facture by status
/**
 * @swagger
 *  /admin/facture/getByStatus/{status}:
 *      get:
 *          summary: get all facture advance
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: status
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The status of facture
 *          responses: 
 *              200:
 *                  description: get advance facture save in the bd
 *              500:
 *                  description: Error during the get
 */
router
    .route('/getByStatus/:status')
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
    .get(tokenVerifieAdmin, validate(FactureValidation.getClientFactures), FactureController.getClientFactures);

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
 *                              amount:
 *                                  type: integer
 *                          example:
 *                              amount: 2000
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/statusPaidFacture/:idFacture')
    .put(tokenVerifie, validate(FactureValidation.statusPaidFacture), FactureController.statusPaidFacture);

/**
 * @swagger
 *  /admin/facture/one/{idFacture}:
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
 */
router
    .route('/one/:idFacture')
    .get(tokenVerifieAdmin, FactureController.getFactureOne)
    .put(tokenVerifieAdmin, validate(FactureValidation.updateFacture), FactureController.updateFacture);


// get Facture By Year
/**
 * @swagger
 *  /admin/facture/factureByYear/{year}:
 *      get:
 *          summary: find factures about year
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: year
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: The year of facture
 *          responses: 
 *              200:
 *                  description: get factures about the year
 *              500:
 *                  description: Error during the get
 */
router
    .route('/factureByYear/:year')
    .get(tokenVerifieAdmin, validate(FactureValidation.findByYear), FactureController.findByYear);


// get one Facture By Year
/**
 * @swagger
 *  /admin/facture/clientFactureByYear/{year}/{idClient}:
 *      get:
 *          summary: get all client invoice in relation to year
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: year
 *                  schema: 
 *                      type: integer
 *                  required: true
 *                  description: The year of facture
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The year of facture
 *          responses: 
 *              200:
 *                  description: get factures about the year
 *              500:
 *                  description: Error during the get
 */
router
    .route('/clientFactureByYear/:year/:idClient')
    .get(tokenVerifieAdmin, validate(FactureValidation.getOneInvoiceByYear), FactureController.getOneInvoiceByYear);



module.exports = router