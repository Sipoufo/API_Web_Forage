const express = require('express');
const validate = require('../../middlewares/validate');
const { adminAuth, stockValidation } = require('../../validation/index');
const { authAdmin, StockController } = require('../../controller/index');
const { tokenVerifieAdmin } = require('../../middlewares/auth')

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Stock
 *  description: Part of API to manage the stock
 */

//Stock Save
/**
 * @swagger
 *  /stock/:
 *      post: 
 *          summary: Stock save
 *          tags: [Stock]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              type:
 *                                  type: string
 *                              prixUnit:
 *                                  type: integer
 *                              quantity:
 *                                  type: integer
 *                              description:
 *                                  type: string
 *                              picture:
 *                                  type: string
 *                          example:
 *                              name: tuyau
 *                              type: tuyau
 *                              prixUnit: 1000
 *                              quantity: 40
 *                              description: "Tuyau de type tuyau en plastique"
 *                              picture: "/test/test/png"
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new stock and return the information about it
 *                                    
 */
router
    .route('/')
    .post(tokenVerifieAdmin, validate(stockValidation.addMateriaux), StockController.addMateriaux);


//Add Type
/**
 * @swagger
 *  /stock/type:
 * 
 *      get: 
 *          summary: get all type
 *          tags: [Stock]
 *          responses: 
 *              200:
 *                  description: get all 
 *              500:
 *                  description: Error
 *      post: 
 *          summary: add type
 *          tags: [Stock]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                          example:
 *                              name: tuyau
 *          responses:
 *              '200':
 *                  description: >
 *                      Add a new type in the collection type
 *                                    
 */
router
    .route('/type')
    .get(tokenVerifieAdmin, StockController.getTypes)
    .post(tokenVerifieAdmin, validate(stockValidation.addType), StockController.addType);

// Delete Type
/**
 * @swagger
 *  /stock/type/{idType}:
 *      delete: 
 *          summary: delete one material in stock
 *          tags: [Stock]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of material
 *          responses: 
 *              200:
 *                  description: get one 
 *              500:
 *                  description: Error
 *                                    
 */
router
    .route('/type')
    .delete(tokenVerifieAdmin, validate(stockValidation.deleteType), StockController.deleteType);

// Update material
/**
 * @swagger
 *  /stock/{id}:
 *      put: 
 *          summary: material update
 *          tags: [Stock]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of material
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              type:
 *                                  type: string
 *                              prixUnit:
 *                                  type: integer
 *                              quantity:
 *                                  type: integer
 *                              description:
 *                                  type: string
 *                              picture:
 *                                  type: string
 *                          example:
 *                              name: tuyau
 *                              type: tuyau
 *                              prixUnit: 1000
 *                              quantity: 40
 *                              description: "Tuyau de type tuyau en plastique"
 *                              picture: "/test/test.png"
 *          responses:
 *              '200':
 *                  description: >
 *                      Update one material in the stock
 * 
 *      get: 
 *          summary: get one material in stock
 *          tags: [Stock]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  schema: 
 *                      type: string
 *                  required: true
 *                  description: The id of material
 *          responses: 
 *              200:
 *                  description: get one 
 *              500:
 *                  description: Error
 *                                    
 */
router
    .route('/:id')
    .put(tokenVerifieAdmin, validate(stockValidation.updateMaterial), StockController.updateMateriaux)
    .get(tokenVerifieAdmin, validate(stockValidation.getOneMateriaux), StockController.getOneMateriaux);

//Get all
/**
 * @swagger
 *  /stock/getAll:
 *      post: 
 *          summary: get all materials in stock
 *          tags: [Stock]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              page:
 *                                  type: integer
 *                              limit:
 *                                  type: integer
 *                          example:
 *                              page: 1
 *                              limit: 10
 *          responses: 
 *              200:
 *                  description: get all 
 *              500:
 *                  description: Error
 *                                    
 */
router
    .route('/getAll')
    .post(tokenVerifieAdmin, validate(stockValidation.getAllMateriaux), StockController.getAllMateriaux);

//Get by type
/**
 * @swagger
 *  /stock/getByType:
 *      post: 
 *          summary: Get by type
 *          tags: [Stock]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              page:
 *                                  type: integer
 *                              limit:
 *                                  type: integer
 *                              type:
 *                                  type: integer
 *                          example:
 *                              page: 1
 *                              limit: 10
 *                              type: tuyau
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new stock and return the information about it
 *                                    
 */
router
    .route('/getByType')
    .post(tokenVerifieAdmin, validate(stockValidation.getGetByType), StockController.getGetByType);

//Get by price
/**
 * @swagger
 *  /stock/getByPrice:
 *      post: 
 *          summary: Get by price
 *          tags: [Stock]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:  
 *                      schema:
 *                          type: object
 *                          properties:
 *                              page:
 *                                  type: integer
 *                              limit:
 *                                  type: integer
 *                              prixUnit:
 *                                  type: integer
 *                          example:
 *                              page: 1
 *                              limit: 10
 *          responses:
 *              '200':
 *                  description: >
 *                      Save your new stock and return the information about it
 *                                    
 */
router
    .route('/getByPrice')
    .post(tokenVerifieAdmin, validate(stockValidation.getGetByPrise), StockController.getGetByPrise);

module.exports = router