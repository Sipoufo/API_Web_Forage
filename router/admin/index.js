const express = require('express');

const authRoute = require('./auth.route');
const factureRoute = require('./facture.route');
const manageCompteRoute = require('./gestionCompte.route');

const router = express.Router();

const adminRoute = [{
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/facture',
        route: factureRoute,
    }, {
        path: '/manageCompte',
        route: manageCompteRoute,
    }
];

adminRoute.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;