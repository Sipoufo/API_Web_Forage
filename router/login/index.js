const express = require('express');
const router = express.Router();

const loginRoute = require('./login.route')

const adminRoute = [{
        path: '/',
        route: loginRoute,
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