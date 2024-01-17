// import the required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// import the routes
const routes = require('./Routes/index');

// initialise the libraries
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5454;

// handle the CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// start using the routes
app.use('/', routes);

// connect to mongodb
mongoose.connect(
    'mongodb+srv://root:XXXXXXXXX@XXXXXXXXXX.gcp.mongodb.net/zomato?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(success => {

    console.log('Connected to MongoDB !!');

    // start the server
    app.listen(port, () => {
        console.log(`Server is up and running on port: ${port}`);
    })

}).catch(err => {
    console.log('Error connecting to MongoDB : ' + err);
});


