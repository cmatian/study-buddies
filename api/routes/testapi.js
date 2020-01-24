var express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("If you see this, the API is working properly.");
});

module.exports = router;
