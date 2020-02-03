
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: process.env.SB_MYSQL_PW,
    database: 'study_buddies'
})

connection.connect((err) => {
    if (err) {
	throw err;
    } else {
	console.log('Connected to MySQL database');
    }
});

module.exports = connection;
