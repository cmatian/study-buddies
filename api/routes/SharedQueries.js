var OAuth2Client = require("google-auth-library").OAuth2Client;
var promisify = require("util").promisify;
var fetch = require("node-fetch");

var dbConnection = require("../database.js");

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

query = promisify(dbConnection.query).bind(dbConnection);

var MAP_API_KEY = 'AIzaSyC4YLPSKd-b0RxRh5kqx8QDnf9yMDioK0Y';

class SharedQueries {
    static getUser(idToken) {
        var googleId;
        return oauth2Client
            .verifyIdToken({
                idToken: idToken,
                audience: process.env.SB_OAUTH_CLIENT_ID,
            })
            .then(ticket => {
                var payload = ticket.getPayload();
                googleId = payload["sub"];
                console.log("googleId: ", googleId);
                return query("SELECT * FROM users where google_id = ?", [googleId]);
            })
            .then(dbResult => {
                if (dbResult.length > 0) {
                    var userId = dbResult[0].user_id;
                    return Promise.resolve(userId);
                } else {
                    return Promise.reject(new Error("Missing user with google_id: " + googleId));
                }
            });
    }

    static upsertLocation(placesId) {
        return query("SELECT * FROM locations where places_id = ?", [placesId])
            .then(dbResult => {
                if (dbResult.length > 0) {
                    console.log("Old location: " + JSON.stringify(dbResult[0]));
                    var locationId = dbResult[0].location_id;
                    return Promise.resolve(locationId);
                } else {
                    console.log("New location, inserting place: " + placesId);
                    return SharedQueries.getPlaceName(placesId)
                        .then(placeName => {
                            console.log("Place name: '" + placeName + "'");
                            return query("INSERT INTO locations (places_id, name) " +
                                         "VALUES (?, ?)", [placesId, placeName]);
                        })
                        .then(dbResult => {
                            console.log("insert location result: ", dbResult);
                            return Promise.resolve(dbResult.insertId);
                        });
                }
            });
    }

    static getPlaceName(placesId) {
        var url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
            placesId + "&fields=name&key=" + MAP_API_KEY;
        return fetch(url, {
            method: "GET"
        })
            .then(response => response.json())
            .then(response => {
                console.log("place data: " + JSON.stringify(response));
                return response.result.name;
            })
    }
}

module.exports = SharedQueries;
