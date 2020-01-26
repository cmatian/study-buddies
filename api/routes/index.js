var express = require('express');
var router = express.Router();
var util = require('util');

var connection = require('../database.js');

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM users', (err, dbRes) => {
	if (err) {
	    console.log("error: ", err);
	    result(err, null);
	    return;
	}

	res.render('index', { title: 'Study Buddies', data: util.inspect(dbRes) });
    });
});

module.exports = router;
