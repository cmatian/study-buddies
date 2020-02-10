var OAuth2Client = require("google-auth-library").OAuth2Client;
var express = require('express');
var router = express.Router();

var oauth2Client = new OAuth2Client(process.env.SB_OAUTH_CLIENT_ID);

router.post('/', function(req, res, next) {
    var idToken = req.body.idToken;
    var ticket = oauth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.SB_OAUTH_CLIENT_ID
    }).then((ticket) => {
        var payload = ticket.getPayload();
        var userId = payload['sub'];
        console.log("userId: ", userId);
        res.json('{}');
    }).catch((error) => {
        console.error('Error', error);
    });
});

module.exports = router;
