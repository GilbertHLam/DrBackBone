const sqlite3 = require('sqlite3');

let users_db;

function initDbs(callback) {
    users_db = new sqlite3.Database(process.env.DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the users database.');
    });
    return callback();
}

function getUsersDb() {
    return users_db;
}

module.exports = {
    getUsersDb,
    initDbs
};