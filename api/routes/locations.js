var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require("express");
var promisify = require("util").promisify;
var router = express.Router();

var dbConnection = require("../database.js");
var SharedQueries = require("./SharedQueries.js");

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection);

router.get("/:places_id", function(req, res, next) {
    console.log("Location get: places ID = " + req.params.places_id);
    var placesId = req.params.places_id;

    query("SELECT * from locations where places_id = ?", [placesId])
        .then(dbResult => {
            if (dbResult.length == 0) {
                console.log("no location");
                var apiResult = { location: null };
                res.json(JSON.stringify(apiResult));
            } else {
                var row = dbResult[0];
                console.log("location: " + JSON.stringify(row));
                location = {
                    location_id: row.location_id,
                    places_id: row.places_id,
                    name: row.name,
                    cost: row.cost,
                    business_type: row.business_type,
                    average_rating: row.average_rating
                };
                var apiResult = { location: location };
                res.json(JSON.stringify(apiResult));
            }
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

module.exports = router;
