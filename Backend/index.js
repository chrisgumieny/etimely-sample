'use strict'
const express = require('express');
const cors = require('cors');
const businessRoutes = require('./Routes/businessRoute');
const availabilityRoute = require('./Routes/availabilityRoute');
const staffRoutes = require('./Routes/staffRoute');
const config = require('./Config/firebaseConfig');
const scheduleRoutes = require('./Routes/scheduleRoute');
const announcementRoutes = require('./Routes/announcementRoute');
const roleRoutes = require('./Routes/roleRoute');
const contactUsRoutes = require('./Routes/contactUsRoute');
const messageRoutes = require('./Routes/messageRoute');
const app = express();

app.use(cors());


// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// middleware for post requests
app.use(express.json());
// middleware for post requests form-data
app.use(express.urlencoded({ extended: false }));
// middleware for post requests form-data, raw
app.use(express.raw({ type: '/' }));
// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error Occured!');
});



// Routes
app.use('/etimely', businessRoutes.routes);
app.use('/etimely', staffRoutes.routes);
app.use('/etimely', availabilityRoute.routes);
app.use('/etimely', scheduleRoutes.routes);
app.use('/etimely', announcementRoutes.routes);
app.use('/etimely', roleRoutes.routes);
app.use('/etimely', contactUsRoutes.routes);
app.use('/etimely', messageRoutes.routes);



// Start the server
app.listen(config.port, () =>
    console.log('App is listening on url http://localhost:' + config.port));