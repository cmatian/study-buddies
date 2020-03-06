var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require("express");
var promisify = require("util").promisify;
var router = express.Router();

var dbConnection = require("../database.js");
var SharedQueries = require("./SharedQueries.js");

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection);

router.post("/", function (req, res, next) {
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

router.get("/", function (req, res, next) {
    SharedQueries.getUser(req.token)
        .then(userId => {
            return query(
                "SELECT r.*, r.name as meeting_name, l.*, l.name as location_name, " +
                    "  s.saved_location_id, s.nickname " +
                    "FROM reservations AS r " +
                    "JOIN locations AS l " +
                    "  ON r.location_id = l.location_id " +
                    "LEFT JOIN saved_locations as s " +
                    "  ON s.location_id = l.location_id " +
                    "  AND s.user_id = r.user_id " +
                    "where r.user_id = ? " +
                    "ORDER BY date_time DESC",
                [userId]
            );
        })
        .then(dbResult => {
            var resultReservations = [];
            for (var i = 0; i < dbResult.length; i++) {
                row = dbResult[i];
                var saved_location = null;
                if (row.saved_location_id != null) {
                    saved_location = {
                        saved_location_id: row.saved_location_id,
                        nickname: row.nickname
                    };
                }
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
                    saved_location: saved_location,
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

router.patch("/:reservation_id", function (req, res, next) {
    console.log("Reservation patch: " + JSON.stringify(req.body));
    reservationId = req.params.reservation_id;
    var setClauseParts = [];
    var parameters = [];
    if (req.body.status != null) {
        setClauseParts.push("status = ?");
        parameters.push(req.body.status);
    }
    if (req.body.group_size != null) {
        setClauseParts.push("group_size = ?");
        parameters.push(req.body.group_size);
    }
    if (req.body.duration_minutes != null) {
        setClauseParts.push("duration_minutes = ?");
        parameters.push(req.body.duration_minutes);
    }
    if (req.body.date_time != null) {
        setClauseParts.push("date_time = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z')");
        parameters.push(req.body.date_time);
    }
    if (req.body.name != null) {
        setClauseParts.push("name = ?");
        parameters.push(req.body.name);
    }

    var updateQuery = "UPDATE reservations SET " + setClauseParts.join(",") + " WHERE reservation_id = ?";
    parameters.push(reservationId);
    console.log("update reservation query: " + updateQuery);

    query(updateQuery, parameters)
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

module.exports = router;
