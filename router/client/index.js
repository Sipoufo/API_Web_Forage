const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route')
const factureRoute = require('./facture.route')

const route = [{
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/facture',
        route: factureRoute,
    }
]

route.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;