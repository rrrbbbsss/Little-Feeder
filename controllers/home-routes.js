const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, PAA, AAA } = require("../utils/auth");

router.get("/", PAA, (req, res) => {
  res.redirect("/article");
});

module.exports = router;
