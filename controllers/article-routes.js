const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, AAA } = require("../utils/auth");

router.get("/", AAA, (req, res) => {
  res.render("article");
});

module.exports = router;
