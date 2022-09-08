const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, AAA, PAA } = require("../utils/auth");
const { Feed, UserFeed } = require("../models");

router.get("/", PAA, async (req, res) => {
  const dbData = await Feed.getAll(req, { Feed, UserFeed });
  const feeds = dbData.map((feed) => feed.get({ plain: true }));
  res.render("feed", { loggedIn: req.session.loggedIn, feeds, feedPage: true });
});

module.exports = router;
