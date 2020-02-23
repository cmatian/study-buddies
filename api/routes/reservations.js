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
    var reservationStatus = "SUBMITTED";
    SharedQueries.getUser(req.token)
        .then(paramUserId => {
            userId = paramUserId;
            return SharedQueries.upsertLocation(req.body.places_id);
        })
        .then(locationId => {
            data = req.body;
            dateTime = data.date + " " + data.time;
            console.log("dateTime: " + dateTime);
            return query(
                "INSERT INTO reservations " +
                    "(user_id, location_id, status, group_size, " +
                    "duration_minutes, date_time, name) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)",
                [userId, locationId, reservationStatus, data.group_size, data.duration_minutes, dateTime, data.name]
            );
        })
        .then(dbResult => {
            console.log("insert reservation result: ", dbResult);
            res.json("{}");
            return;
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

router.get("/", function(req, res, next) {
    SharedQueries.getUser(req.token)
        .then(userId => {
            return query(
                "SELECT *, r.name as meeting_name, l.name as location_name FROM reservations AS r " +
                    "JOIN locations AS l ON r.location_id = l.location_id " +
                    "where user_id = ?",
                [userId]
            );
        })
        .then(dbResult => {
            var resultReservations = [];
            for (var i = 0; i < dbResult.length; i++) {
                row = dbResult[i];
                console.log("reservation: " + JSON.stringify(row));
                resultReservations.push({
                    reservation_id: row.reservation_id,
                    user_id: row.user_id,
                    status: row.status,
                    group_size: row.group_size,
                    duration_minutes: row.duration_minutes,
                    date_time: row.date_time,
                    name: row.meeting_name,
                    location: {
                        location_id: row.location_id,
                        places_id: row.places_id,
                        name: row.location_name,
                        cost: row.cost,
                        business_type: row.business_type,
                        average_rating: row.average_rating,
                    },
                });
            }
            var apiResult = { reservations: resultReservations };
            res.json(JSON.stringify(apiResult));
        })
        .catch(error => {
            console.error("Error", error);
            next(error);
        });
});

module.exports = router;
