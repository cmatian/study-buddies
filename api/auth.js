
function init(app) {
    // based on http://gregtrowbridge.com/node-authentication-with-google-oauth-part1-sessions/
    var passport = require('passport');
    var GoogleStrategy = require('passport-google-oauth20').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((userDataFromCookie, done) => {
        done(null, {'id': userDataFromCookie});
    });

    var strategyOptions = {
        clientID: process.env.SB_OAUTH_CLIENT_ID,
        clientSecret: process.env.SB_OAUTH_CLIENT_SECRET,
        callbackURL: 'http://localhost:9000/auth/google/callback',
        scope: ['email'],
    };
    var verify = function(accessToken, refreshToken, profile, callback) {
        return callback(null, profile);
    };
    passport.use(new GoogleStrategy(strategyOptions, verify));

    var passportAuthenticate = passport.authenticate('google', { failureRedirect: '/', session: true });
    var success = function(req, res) {
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
        req.session.returnTo = null;
    }
    app.get('/auth/google/callback', passportAuthenticate, success);
}

// Checks if a user is logged in
const checkAuth = (req, res, next) => {  
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.returnTo = req.originalUrl; 
        res.redirect('/auth/google/callback');
    }
};

module.exports.init = init;
module.exports.checkAuth = checkAuth;
