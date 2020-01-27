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

	var user_id = null;
	if (req.isAuthenticated()) {
	    user_id = req.user.id;
	    console.log('authenticated user: ' + user_id);
	} else {
	    console.log('unauthenticated user');
	}
	res.render('index', { title: 'Study Buddies', user_id: user_id, data: util.inspect(dbRes) });
    });
});

module.exports = router;
