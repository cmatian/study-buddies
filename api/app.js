var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressHandlebars = require("express-handlebars");
var cors = require("cors"); // cross origin resource sharing - absolutely required
var session = require("express-session");
require("dotenv").config(); // for process environments - only for development (remove for production)

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testapiRouter = require("./routes/testapi");
var auth = require("./auth.js");

var app = express();

// view engine setup
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SB_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Must come after session initialization
auth.init(app);

app.use(express.static(`../client/build`));

// Define Routes here
app.use("/express-index", indexRouter);
app.use("/testapi", testapiRouter);
app.use("/users", usersRouter);

app.use((req, res, next) => {
    var matched = ["/maps", "/biz", "/users"].some(prefix => {
        return req.url.startsWith(prefix);
    });
    if (matched) {
        console.log("Routing to React: " + req.url)
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    } else {
        res.status(404).send('Not found')
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
