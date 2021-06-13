const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet');
const app = express()
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors')
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParse = require('cookie-parser')
const compression = require('compression');
const adminroutes = require('./router/admin/index')
    // const routes = require('./router/client/index')

dotenv.config({ path: './.env' })
const PORT = process.env.PORT

mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connection successfully !'))
    .catch(() => console.log('Lost connection !'))

// set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false,
}));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//Parse Cookies
app.use(cookieParse())

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(cors())

app.options('*', cors())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });


// client api routes
// app.use('/client', routes);
// admin routes
app.use('/admin', adminroutes)

app.get('*', (req, res) => {
    res.status(500).json({ status: 500, error: "This route don't existe" })
})

app.listen(PORT, () => {
    console.log(`We listening with the port ${PORT}`)
})