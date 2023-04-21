const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');

const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' })

const router = express.Router();

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-boilerplate API documentation',
        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
        },
    },
    components: {
        securitySchemes: {
            Authorization: {
                type: "http",
                scheme: "bearer",
                in: 'header',
                bearerFormat: "Authorization"
            }
        }
    },
    security: [{
        Authorization: []
    }],
    servers: [{
        url: `http://localhost:4000`,
    }, {
        url: `http://194.31.52.20:4000`,
    }],
};

const specs = swaggerJsdoc({
    swaggerDefinition: swaggerDef,
    apis: ['router/client/*.js', 'router/admin/*.js', 'router/login/*.js', 'router/stock/*.js'],
});

router.use('/', swaggerUi.serve);
router.get(
    '/',
    swaggerUi.setup(specs, {
        explorer: true,
    })
);

module.exports = router;