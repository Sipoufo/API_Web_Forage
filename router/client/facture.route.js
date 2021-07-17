const express = require('express');
const validate = require('../../middlewares/validate');
const { ClientFactureValidation } = require('../../validation/index');
const { ClientFactureController } = require('../../controller/index');
const { tokenVerifieClient, tokenVerifie } = require('../../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Facture_Client
 *  description: Part of API to manage the factures
 */


/**
 * @swagger
 *  /client/facture:
 *      get:
 *          summary: All facture for One client
 *          tags: [Facture_Client]
 *          responses:
 *              200:
 *                  description: return all the facture for one client
 *              500:
 *                  description: Error while the get all the facture
 */
router
    .route('/')
    .get(tokenVerifieClient, ClientFactureController.getFactures)

/**
 * @swagger
 *  /client/facture/paid/{idFacture}:
 *      put: 
 *          summary: Add facture
 *          tags: [Facture_Client]
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
 *                              montant:
 *                                  type: integer
 *                          example:
 *                              status: true
 *                              montant: 28000
 *          responses:
 *              '201':
 *                  description: >
 *                      Update the status of facture 
 *                                    
 */
router
    .route('/paid/:idFacture')
    .put(tokenVerifieClient, validate(ClientFactureValidation.statusPaidFacture), ClientFactureController.statusPaidFacture)

/**
 * @swagger
 *  /client/facture/advance/{idFacture}:
 *      put: 
 *          summary: Add facture
 *          tags: [Facture_Client]
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
 *                              AdvanceCount:
 *                                  type: integer
 *                              advanceDate:
 *                                  type: string
 *                          example:
 *                              AdvanceCount: 5000
 *                              advanceDate: 2012-07-14
 *          responses:
 *              '201':
 *                  description: >
 *                      Update the status of facture 
 *                                    
 */
router
    .route('/advance/:idFacture')
    .put(tokenVerifieClient, validate(ClientFactureValidation.advanceFacture), ClientFactureController.advanceFacture)

/**
 * @swagger
 *  /client/facture/getFactureAdvance:
 *      get:
 *          summary: All facture advance
 *          tags: [Facture_Client]
 *          responses:
 *              200:
 *                  description: return all the facture for all
 *              500:
 *                  description: Error while the get all the facture
 */
router
    .route('/getFactureAdvance')
    .get(tokenVerifieClient, ClientFactureController.getFactureAdvance)

module.exports = router