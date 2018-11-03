const sqlite3 = require('sqlite3');

const {genRandomString} = require('./utils');
const {
    getMedicationsDb
} = require('./db');

function getAllMedications(request, response) {
    let returnObj = {};
    let dateFilter = request.query.date ? `AND date LIKE "%${request.query.date}%"`: null;
    let medicalConditionIdFilter = request.query.medicalConditionId ? `AND medicalConditionId LIKE "%${request.query.medicalConditionId}%"`: null;

    let userID = request.body.userId;
    let listOfMedications = [];
    let database = getMedicationsDb();
    const sql = `SELECT name, date, uniqueId FROM medications WHERE userId LIKE "%${userID}%" ${dateFilter} ${medicalConditionIdFilter} ORDER BY date;`;
    database.all(sql, [], (err, row) => {
        row.forEach((element) => {
            listOfMedications.push({
                name: element.name,
                date: element.date,
                uniqueId: element.uniqueId
            });
        });
        returnObj.results = listOfMedications;
        response.json(returnObj);
        response.end();
    });
}

function editMedication(request, response) {
    var returnObj = {};
    let database = getMedicationsDb();
    let {
        medicalConditionId,
        title,
        dose,
        frequency,
        timePeriod,
        notes,
        userId,
        date,
        uniqueId
    } = request.body;

    var sqlUpdate = `UPDATE medication SET medicalConditionId = ${medicalConditionId}, title = ${title}, dose = ${dose}, frequency = ${frequency}, timePeriod = ${timePeriod}, notes = ${notes}, userId = ${userId}, date = ${date} WHERE uniqueId LIKE "%${uniqueId}%";`;
    database.run(sqlUpdate, [], function (err) {
        if (err) {
            returnObj.error = true;
            return console.error(err.message);
        } else {
            returnObj.error = false;
        }
        response.json(returnObj);
        response.end();
    });
}

function getMedicationInfo(request, response) {
    let returnObj = {};

    let uniqueId = request.body.uniqueId;
    let listOfMedications = [];
    let database = getMedicationsDb();
    const sql = `SELECT * FROM medications WHERE uniqueId LIKE "%${uniqueId}%"`;
    database.all(sql, [], (err, row) => {
        row.forEach((element) => {
            listOfMedications.push({
                medicalConditionId: medicalConditionId,
                name: name,
                dose: dose,
                frequency: frequency,
                timePeriod: timePeriod,
                notes: notes,
                userId: userId,
                date: date,
                uniqueId: uniqueId
            });
        });
        returnObj.results = listOfMedications;
        response.json(returnObj);
        response.end();
    });
}

function addMedication(request, response) {
    let returnObj = {};
    let database = getMedicationsDb();
    const uniqueId = genRandomString(16);
    let {
        medicalConditionId,
        name,
        dose,
        frequency,
        timePeriod,
        notes,
        userId,
        date,
    } = request.body;

    try {
        var sqlInsert = database.prepare('INSERT INTO medications (medicalConditionId, name, dose, frequency, timePeriod, notes, userId, date, uniqueId) VALUES (?,?,?,?,?,?,?,?,?);');
        sqlInsert.run(medicalConditionId, name, dose, frequency, timePeriod, notes, userId, date, uniqueId);
        sqlInsert.finalize();
        returnObj.error = false;
        response.json(returnObj);
        response.end();
    } catch (err) {
        console.log(err);
        returnObj.error = true;
        response.json(returnObj);
        response.end();
    }
}

module.exports = {
    getAllMedications,
    editMedication,
    addMedication,
    getMedicationInfo
};