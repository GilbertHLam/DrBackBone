const sqlite3 = require('sqlite3');

let users_db, medications_db, medical_conditions_db;

function initDbs() {
    users_db = new sqlite3.Database(process.env.DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the users database.');
        }
    });

    medications_db = new sqlite3.Database(process.env.MEDICATION_DB, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the medications database.');
        }
    });

    medical_conditions_db = new sqlite3.Database(process.env.MEDICAL_CONDITIONS_DB, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the medical conditions database.');
        }
    });
}

function getUsersDb() {
    return users_db;
}

function getMedicationsDb() {
    return medications_db;
}

function getMedicalConditionsDb() {
    return medical_conditions_db;
}

module.exports = {
    getUsersDb,
    initDbs,
    getMedicationsDb,
    getMedicalConditionsDb
};