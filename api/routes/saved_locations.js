var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require("express");
var promisify = require("util").promisify;
var router = express.Router();

var dbConnection = require("../database.js");
var SharedQueries = require("./SharedQueries.js");

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection);

router.post("/", function(req, res, next) {
    var userId;
    SharedQueries.getUser(req.token)
        .then(paramUserId => {
            userId = paramUserId;
            return SharedQueries.upsertLocation(req.body.places_id);
        })
        .then(locationId => {
            data = req.body;
            return query(
                "INSERT INTO saved_locations " +
                    "(user_id, location_id, nickname) " +
                    "VALUES (?, ?, ?)",
                [userId, locationId, data.nickname]
            );
        })
        .then(dbResult => {
            console.log("insert saved location result: ", dbResult);
            res.json("{}");
            return;
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

module.exports = router;
