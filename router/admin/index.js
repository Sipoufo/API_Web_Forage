const express = require('express');

const authRoute = require('./auth.route');
const factureRoute = require('./facture.route');

const router = express.Router();

const adminRoute = [{
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/facture',
        route: factureRoute,
    }
];

adminRoute.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;