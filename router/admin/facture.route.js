const express = require('express');
const validate = require('../../middlewares/validate');
const { FactureValidation } = require('../../validation/index');
const { FactureController, PenaltyController } = require('../../controller/index');
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
 *  /admin/facture/getStaticInformation:
 *      get:
 *          summary: get all statics information
 *          tags: [Facture_Admin]
 *          responses: 
 *              200:
 *                  description: get all statics information
 */
router
    .route('/getStaticInformation')
    .get(tokenVerifieAdmin, FactureController.getStaticInformation);



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



// Static information
/**
 * @swagger
 *  /admin/facture/staticInformation:
 *      post: 
 *          summary: Add static information about facture
 *          tags: [Facture_Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              prixUnitaire:
 *                                  type: integer
 *                              fraisEntretien:
 *                                  type: integer
 *                              limiteDay:
 *                                  type: integer
 *                          example:
 *                              prixUnitaire: 500
 *                              fraisEntretien: 1000
 *                              limiteDay: 02
 *          responses:
 *              '201':
 *                  description: >
 *                      Save your new admin and return the information about it
 *                                    
 */
router
    .route('/staticInformation')
    .post(tokenVerifie, validate(FactureValidation.addInformation), FactureController.addInformation);


// Pe information
/**
 * @swagger
 *  /admin/facture/penalty:
 *      post: 
 *          summary: Add information about a penalty
 *          tags: [Facture_Admin]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              dayActivation:
 *                                  type: integer
 *                              pas:
 *                                  type: integer
 *                              percentageAmountAdd:
 *                                  type: integer
 *                          example:
 *                              dayActivation: 10
 *                              pas: 5
 *                              percentageAmountAdd: 1
 *          responses:
 *              '201':
 *                  description: >
 *                      add information about a penalty
 *                                    
 */
router
    .route('/staticInformation')
    .post(tokenVerifie, validate(FactureValidation.addPenalty), PenaltyController.addPenalty);



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
 *                              dateReleveNewIndex:
 *                                  type: string
 *                              oldIndex:
 *                                  type: integer
 *                          example:
 *                              newIndex: 150
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
    .get(tokenVerifie, FactureController.getFactureOne)
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
    .get(tokenVerifieAdmin, validate(FactureValidation.seeUnpaidInvoicewithDate), FactureController.seeUnpaidInvoicewithDate);

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
// get one Facture By Year
/**
 * @swagger
 *  /admin/facture/doInvoiceWithDate/{dateUnpaid}:
 *      get:
 *          summary: See unpaid invoice with date
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: dateUnpaid
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: Date
 *          responses: 
 *              200:
 *                  description: get factures
 */
router
    .route('/doInvoiceWithDate/:dateUnpaid')
    .get(tokenVerifieAdmin, validate(FactureValidation.seeUnpaidInvoicewithDate), FactureController.seeUnpaidInvoicewithDate);

// have a invoice
/**
 * @swagger
 *  /admin/facture/haveInvoice/{idClient}:
 *      get: 
 *          summary: See if a customer have a invoice
 *          tags: [Facture_Admin]
 *          parameters:
 *              -   in: path
 *                  name: idClient
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: id of customer
 *          responses:
 *              '201':
 *                  description: >
 *                      return a boolean for check if a customer have invoice
 *                                    
 */
router
    .route('/haveInvoice/:idClient')
    .get(tokenVerifie, validate(FactureValidation.haveInvoice), FactureController.haveInvoice);



module.exports = router