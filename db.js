const sqlite3 = require('sqlite3');

let users_db, medications_db;

function initDbs(callback) {
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
    return callback();
}

function getUsersDb() {
    return users_db;
}

function getMedicationsDb() {
    return medications_db;
}

module.exports = {
    getUsersDb,
    initDbs,
    getMedicationsDb
};