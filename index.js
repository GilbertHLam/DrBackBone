require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const app = express();
const {getUsersDb, initDbs} = require('./db');

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/login', (request, response) => {
    var usersDB = getUsersDb();
    var returnObj = {};
    var tempUser = request.body.username.toUpperCase();
    var tempPass = request.body.password;
    var sqlQuery = 'SELECT ' + process.env.LOGIN_TABLE + ', hash FROM ' + process.env.LOGIN_DB + ' WHERE ' + process.env.LOGIN_KEY + ' LIKE "%' + tempUser + '%";';
    usersDB.all(sqlQuery, [], (err, rows) => {
        if (err)
            throw err;
        rows.forEach((element) => {
            if (element[process.env.LOGIN_TABLE] === (sha512(tempPass, element.hash).passwordHash))
                returnObj.error = false;
            else
                returnObj.error = true;
            response.json(returnObj);
        });
    });
});

app.post('/signup', (request, response) => {
    var usersDB = getUsersDb();
    var returnObj = {};
    var tempUser = request.body.username.toUpperCase();
    var tempPass = request.body.password;
    var sqlQuery = 'SELECT * FROM ' + process.env.LOGIN_DB + ' WHERE ' + process.env.LOGIN_KEY + ' LIKE "%' + tempUser + '%";';
    usersDB.all(sqlQuery, [], (err, rows) => {
        if (err)
            throw err;
        if (rows.length !== 0) {
            returnObj.error = true;
            returnObj.passwordError = "User already exists";
            response.json(returnObj);
        } else {
            var goodPass = checkPassword(tempPass);
            var newSalt = genRandomString(16);
            var newPass = sha512(tempPass, newSalt);
            if (goodPass === ('ok')) {
                var sqlInsert = usersDB.prepare('INSERT INTO ' + process.env.LOGIN_DB + ' (' + process.env.LOGIN_KEY + ', ' + process.env.LOGIN_TABLE + ', hash) VALUES (?,?,?);');
                sqlInsert.run(tempUser, newPass.passwordHash, newSalt);
                sqlInsert.finalize();
                returnObj.error = false;
                response.json(returnObj);
            } else {
                returnObj.error = true;
                returnObj.passwordError = goodPass;
                response.json(returnObj);
            }
        }
    });
});

//Returns random salt
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
};


function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function checkPassword(password) {
    if (password.length < 6) {
        return ("Password too short!");
    } else if (password.search(/\d/) === -1) {
        return ("Password doesn't contain numbers!");
    } else if (password.search(/[a-zA-Z]/) === -1) {
        return ("Password doesn't contain any letters!");
    }
    return ("ok");
}

initDbs(function () {
    app.listen(port);
    console.log('Listening on ' + port);
});