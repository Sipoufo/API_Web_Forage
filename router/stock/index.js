const express = require('express');

const stock = require('./materiaux.route');

const router = express.Router();

const adminRoute = [{
    path: '/',
    route: stock,
}, ];

adminRoute.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;