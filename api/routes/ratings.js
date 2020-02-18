var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require('express');
var promisify = require('util').promisify;
var router = express.Router();

var dbConnection = require('../database.js');

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection);

router.post('/', function(req, res, next) {
    var googleId;
    var userId;
    var locationId;
    var ticket = oauth2Client.verifyIdToken({
        idToken: req.token,
        audience: process.env.SB_OAUTH_CLIENT_ID
    }).then((ticket) => {
        var payload = ticket.getPayload();
        googleId = payload['sub'];
        console.log("googleId: ", googleId);
        return query("SELECT * FROM users where google_id = ?", [googleId]);
    }).then((dbResult) => {
        if (dbResult.length > 0) {
            userId = dbResult[0].user_id;
            return query("SELECT * FROM locations where places_id = ?", [req.body.places_id]);
        } else {
            return Promise.reject(new Error("Missing user with google_id: " + googleId));
        }
    }).then((dbResult) => {
        if (dbResult.length > 0) {
            console.log("Old location: " + JSON.stringify(dbResult[0]));
            locationId = dbResult[0].location_id;
            return Promise.resolve({});
        } else {
            console.log("New location, inserting place: " + req.body.places_id);
            return query("INSERT INTO locations (places_id) VALUES (?)", [req.body.places_id])
            .then((dbResult) => {
                console.log("insert location result: ", dbResult);
                return Promise.resolve({});
            });
        }
    }).then((dummy) => {
        data = req.body;
        return query("INSERT INTO ratings "
                     + "(user_id, location_id, rating, comment, cost) "
                     + "VALUES (?, ?, ?, ?, ?)",
                     [userId, locationId, data.rating, data.comment,
                      data.cost]);
    }).then((dbResult) => {
        console.log("insert rating result: ", dbResult);
        res.json('{}');
        return;
    }).catch((error) => {
        console.error('Error', error);
        next(error);
    });
});

module.exports = router;
