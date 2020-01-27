var express = require('express');
var auth = require('../auth');

var router = express.Router();

router.get('/me', auth.checkAuth, (req, res) => {
    res.render('users', { title: 'Study Buddies', user_id: req.user.id });
});

module.exports = router;
