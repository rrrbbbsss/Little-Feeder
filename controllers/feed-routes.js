const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, AAA, PAA } = require("../utils/auth");

router.get("/", PAA, (req, res) => {
  res.render("feed", { loggedIn: req.session.loggedIn });
});

module.exports = router;
