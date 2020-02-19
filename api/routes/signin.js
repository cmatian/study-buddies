var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require('express');
var promisify = require('util').promisify;
var router = express.Router();

var dbConnection = require('../database.js');

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection)

router.post('/', function(req, res, next) {
    var idToken = req.body.idToken;
    var userId;
    var ticket = oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.SB_OAUTH_CLIENT_ID
    }).then((ticket) => {
        var payload = ticket.getPayload();
        userId = payload['sub'];
        console.log("userId: ", userId);
        return query("SELECT * FROM users where google_id = ?", [userId]);
    }).then((dbResult) => {
        if (dbResult.length > 0) {
            console.log("Old user: " + userId);
            res.json('{}');
            return;
        } else {
            console.log("New user, inserting: " + userId);
            return query("INSERT INTO users (google_id) VALUES (?)", [userId])
            .then((dbResult) => {
                console.log("result: ", dbResult);
                res.json('{}');
                return;
            });
        }
    }).catch((error) => {
        console.error('Error', error);
        next(error);
    });
});

module.exports = router;
