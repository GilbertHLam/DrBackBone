require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { initDbs} = require('./db');
const { login, signup } = require('./authentications')

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Authentication routes
app.post('/login', (request, response) => {
    login(request, response);
});

app.post('/signup', (request, response) => {
    signup(request, response);
});


initDbs(function () {
    app.listen(port);
    console.log('Listening on ' + port);
});