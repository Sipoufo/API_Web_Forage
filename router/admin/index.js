const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route')

const adminRoute = [{
        path: '/auth',
        route: authRoute,
    },
    // {
    //     path: '/auth',
    //     route: authAdminRoute,
    // }
]

adminRoute.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;