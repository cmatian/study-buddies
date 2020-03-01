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

router.delete("/for_place/:places_id", function(req, res, next) {
    console.log("Location delete: places ID = " + req.params.places_id);
    var placesId = req.params.places_id;

    SharedQueries.getUser(req.token)
        .then(userId => {
            return query("DELETE s FROM saved_locations s " +
                         "LEFT JOIN locations l " +
                         "  ON l.location_id = s.location_id " +
                         "WHERE s.user_id = ? " +
                         "AND l.places_id = ?", [userId, placesId])
        })
        .then(dbResult => {
            console.log("Delete result: ", dbResult);
            res.json("{}");
            return;
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

module.exports = router;
