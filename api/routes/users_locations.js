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
    var userId;
    var coreDbResult;

    SharedQueries.getUser(req.token)
        .then(paramUserId => {
            userId = paramUserId;
            return query("SELECT * from locations AS l " +
                         // There should be only 1 saved location record for a user
                         "LEFT JOIN saved_locations AS s " +
                         "  ON s.location_id = l.location_id " +
                         "  AND s.user_id = ? " +
                         // There should be only 1 rating record for a user
                         "LEFT JOIN ratings AS r " +
                         "  ON r.location_id = l.location_id " +
                         "  AND r.user_id = ? " +
                         "WHERE l.places_id = ?", [userId, userId, placesId]);
        })
        .then(dbResult => {
            coreDbResult = dbResult;
            // Do a separate query because there may be multiple reservations
            // for a location
            return query("SELECT r.* from locations AS l " +
                         "LEFT JOIN reservations AS r " +
                         "  ON r.location_id = l.location_id " +
                         "  AND r.user_id = ? " +
                         "WHERE l.places_id = ?", [userId, placesId]);
        })
        .then(reservationsDbResult => {
            if (coreDbResult.length == 0) {
                console.log("no location");
                var apiResult = { location: null };
                res.json(JSON.stringify(apiResult));
            } else {
                row = coreDbResult[0];
                console.log("location: " + JSON.stringify(row));
                saved_location = null;
                if (row.saved_location_id != null) {
                    saved_location = {
                        saved_location_id: row.saved_location_id,
                        nickname: row.nickname
                    };
                }
                rating = null;
                if (row.rating_id != null) {
                    rating = {
                        rating_id: row.rating_id,
                        rating: row.rating,
                        comment: row.comment,
                        cost: row.cost
                    };
                }
                reservations = [];
                for (var i = 0; i < reservationsDbResult.length; i++) {
                    resRow = reservationsDbResult[i];
                    reservations.push({
                        reservation_id: resRow.reservation_id,
                        status: resRow.status,
                        group_size: resRow.group_size,
                        duration_minutes: resRow.duration_minutes,
                        date_time: resRow.date_time,
                        name: resRow.meeting_name
                    });
                }
                location = {
                    location_id: row.location_id,
                    places_id: row.places_id,
                    name: row.name,
                    cost: row.cost,
                    business_type: row.business_type,
                    average_rating: row.average_rating,
                    saved_location: saved_location,
                    rating: rating,
                    reservations: reservations
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
