const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'db123',
    database: 'milkano'
});

module.exports = connection;