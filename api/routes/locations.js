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

    query("SELECT *, r.cost as rating_cost from locations l " +
          "LEFT JOIN ratings AS r " +
          "  ON r.location_id = l.location_id " +
          "LEFT JOIN users AS u " +
          "  ON u.user_id = r.user_id " +
          "WHERE places_id = ?", [placesId])
        .then(dbResult => {
            if (dbResult.length == 0) {
                console.log("no location");
                var apiResult = { location: null };
                res.json(JSON.stringify(apiResult));
            } else {
                var row = dbResult[0];
                var ratings = [];
                // each row will have distinct rating details
                for (var i = 0; i < dbResult.length; i++) {
                    ratingRow = dbResult[i];
                    if (ratingRow.rating_id == null) {
                        continue;
                    }
                    ratings.push({
                        rating_id: ratingRow.rating_id,
                        rating: ratingRow.rating,
                        text: ratingRow.comment,    // change to text to match google api 
                        cost: ratingRow.rating_cost,
                        user: {
                            user_id: ratingRow.user_id,
                            google_id: ratingRow.google_id,
                            // username: ratingRow.username,
                        },
                        author_name: ratingRow.username,    // moved it to match google api
                    });
                }
                location = {
                    location_id: row.location_id,
                    places_id: row.places_id,
                    name: row.name,
                    cost: row.cost,
                    business_type: row.business_type,
                    average_rating: row.average_rating,
                    ratings: ratings,
                };
                var apiResult = { location: location };
                console.log("apiResult: " + JSON.stringify(apiResult));
                res.json(JSON.stringify(apiResult));
            }
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

module.exports = router;
