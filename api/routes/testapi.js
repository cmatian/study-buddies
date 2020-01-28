var express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("React router is receiving this message from the Express Server.");
});

module.exports = router;
