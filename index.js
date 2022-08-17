const express = require('express')
const mongoose = require('mongoose');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io')
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require('dotenv');
const httpStatus = require('http-status');
const path = require('path');
const ApiError = require('./utils/ApiError');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParse = require('cookie-parser');
const compression = require('compression');
const cron = require('node-cron');
const adminroutes = require('./router/admin/index');
const login = require('./router/login/index');
const stock = require('./router/stock/index');
const docs = require('./router/docs/docs.route');
const userRoutes = require('./router/client/index');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { Facture, Penalty, StaticInf } = require('./models/index');

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

// socket
io.on('connection', () => {
    console.log('a user connected');
});

// cron process
// cron.schedule('* * * 1 * *', async () => {
//     console.log('Verify if customer have penalty');
//     let amount = 0;
//     let doPenalty = false;
//     const staticInformation = await StaticInf.find().sort( { createdAt: -1 } );
//     const penaltyInformation = await Penalty.find().sort( { createdAt: -1 } );
//     if(penaltyInformation.length > 0 && staticInformation.length > 0) {
//         Facture.find( { facturePay: false } )
//             .sort( { dateReleveNewIndex: -1 } )
//             .then(async (invoice) => {
//                 if(invoice.length > 0) {
//                     const dateLimite = new Date(invoice[0].dateReleveNewIndex.getFullYear(), invoice[0].dateReleveNewIndex.getMonth() + 2, staticInformation[0].limiteDay);
//                     const actualDate = new Date()
//                     console.log(dateLimite.getTime())
//                     console.log(actualDate.getTime())
//                     if (dateLimite.getTime() < actualDate.getTime()) {
//                         for (let i = 0; i < invoice.length; i++) {
//                             if ( invoice[i].penalty.length > 0 ) {
//                                 const oldDate = invoice[i].penalty[invoice[i].penalty.length - 1].date;
//                                 const nextDay = new Date(oldDate.getFullYear(), oldDate.getMonth() + 1, oldDate.getDate() + staticInformation[0].limiteDay);
//                                 if(actualDate.getTime() >= nextDay.getTime()) {
//                                     doPenalty = true
//                                     amount = invoice[i].penalty[ invoice[i].penalty.length - 1] + ( penaltyInformation[0].amountAdd )
//                                 }
//                             } else {
//                                 amount = penaltyInformation[0].amountAdd
//                                 doPenalty = true
//                             }
//                             if (doPenalty) {
//                                 const montantConsommation = invoice[i].montantConsommation + penaltyInformation[0].amountAdd;
//                                 const montantImpaye = invoice[i].montantImpaye + penaltyInformation[0].amountAdd;
//                                 await Facture.findByIdAndUpdate( invoice[i]._id, { montantConsommation, montantImpaye, $push: { penalty: { montant: amount, date: new Date() } } } )
//                             }
//                         }
//                     } else {
//                         console.log("It's not a billing day")
//                     }
//                 }
//             })
//     } else {
//         console.log("Please enter static and penalty information")
//     }
// });

// client api routes
app.use('/client', userRoutes);

// admin routes
app.use('/admin', adminroutes)

// log routes
app.use('/login', login)

// stock
app.use('/stock', stock)

// admin routes
app.use('/docs', docs)

// app.get('*', (req, res) => {
//     res.status(500).json({ status: 500, error: "This route don't existe" })
// })

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`We listening with the port ${PORT}`)
})