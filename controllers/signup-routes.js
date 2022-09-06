const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, AAA, PAA } = require("../utils/auth");

router.get("/", PUB, (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/feed");
  } else {
    res.render("signup", { loggedIn: req.session.loggedIn });
  }
});

module.exports = router;
