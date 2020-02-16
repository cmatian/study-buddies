var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require('express');
var promisify = require('util').promisify;
var router = express.Router();

var dbConnection = require('../database.js');

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection)

router.post('/', function(req, res, next) {
    var googleId;
    var userId;
    var locationId;
    var reservationStatus = "SUBMITTED";
    var ticket = oauth2Client.verifyIdToken({
        idToken: req.body.user_token,
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
        dateTime = data.date + " " + data.time;
        console.log("dateTime: " + dateTime);
        return query("INSERT INTO reservations "
                     + "(user_id, location_id, status, group_size, "
                     + "duration_minutes, date_time, name) "
                     + "VALUES (?, ?, ?, ?, ?, ?, ?)",
                     [userId, locationId, reservationStatus, data.group_size,
                      data.duration_minutes, dateTime, data.name]);
    }).then((dbResult) => {
        console.log("insert reservation result: ", dbResult);
        res.json('{}');
        return;
    }).catch((error) => {
        console.error('Error', error);
        next(error);
    });
});

module.exports = router;