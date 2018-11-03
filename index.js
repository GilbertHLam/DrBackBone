require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const { initDbs } = require('./db');
const { login, signup } = require('./authentications')
const { getAllMedications, editMedication, addMedication } = require('./medications')
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


// Authentication routes
app.post('/login', (request, response) => {
    login(request, response);
});

app.post('/signup', (request, response) => {
    signup(request, response);
});

//Medication routes
app.post('/getAllMedications', (request, response) => {
    getAllMedications(request, response);
});

app.post('/addMedication', (request, response) => {
    addMedication(request, response);
});

app.post('/editMedication', (request, response) => {
    editMedication(request, response);
});

initDbs();
app.listen(port);
console.log('Listening on ' + port);