const router = require("express").Router();
const { User, Feed, UserFeed, Article, UserArticle } = require("../../models");
const dbconn = require("../../config/connection");
const { PUB, AAA } = require("../../utils/auth");

//////////////////////////////////////////////////////
//////////////// Feed API routes: ////////////////////
//////////////////////////////////////////////////////
//
// description: get feeds (of the requesting user)
// path: /api/feed
// method: GET
//
//////////////////////////////////////////////////////
//
// description: get one feed (of the requesting user)
// path: /api/feed/:id
// method: GET
//
//////////////////////////////////////////////////////
//
// description: create a new feed (of the requesting user)
// path: /api/feed
// method: POST
// body: {
//   "url": "https://www.reddit.com/.rss",
//   "description": "reddit's front page",
// }
//
//////////////////////////////////////////////////////
//
// description: edit a feed
// path: /api/feed/:id
// method: PUT
// body: {
//   "description": "a subreddit feed"
// }
//
//////////////////////////////////////////////////////
//
// description: delete a feed
// path: /api/feed/:id
// method: DELETE
//
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// GET /api/feed
// todo: better error messaging
router.get("/", AAA, (req, res) => {
  UserFeed.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: [
      [dbconn.col("Feed.id"), "id"],
      [dbconn.col("Feed.url"), "url"],
      "description",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Feed,
        attributes: [],
      },
    ],
  })
    .then((dbData) => {
      const feeds = dbData.map((feed) => feed.get({ plain: true }));
      res.json(feeds);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server get feed error" });
    });
});

// GET /api/feed/:id
// todo: better error messaging
router.get("/:id", AAA, (req, res) => {
  UserFeed.findOne({
    where: {
      feed_id: req.params.id,
      user_id: req.session.user_id,
    },
    attributes: [
      [dbconn.col("Feed.id"), "id"],
      [dbconn.col("Feed.url"), "url"],
      "description",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Feed,
        attributes: [],
      },
    ],
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "No feed found with this id" });
        return;
      }
      const feed = dbData.get({ plain: true });
      res.json(feed);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server get feed error" });
    });
});

// POST /api/feed
// todo: better error messaging
router.post("/", AAA, (req, res) => {
  // expects: { url: "https://blah.com", description: "asdf"}
  // todo: validate body before attempting to create feed
  Feed.propogateCreate(req, { Feed, UserFeed })
    .then(([dbData, created]) => {
      feed = dbData.get({ plain: true });
      res.json(feed);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server post feed error" });
    });
});

// PUT /api/feed/:id
// todo: better error messaging
router.put("/:id", AAA, (req, res) => {
  // expects: { description: "asdf" }
  // todo: validate body before attempting to update feed
  UserFeed.update(
    {
      description: req.body.description,
    },
    {
      where: {
        user_id: req.session.user_id,
        feed_id: req.params.id,
      },
    }
  )
    .then((dbData) => {
      // todo: if it doens't find resource, return a better status
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server put feed error" });
    });
});

// DELETE /api/feed/:id
// todo: better error messaging
router.delete("/:id", AAA, (req, res) => {
  // expects: {}
  Feed.propogateDelete(req, { Feed, UserFeed, Article, UserArticle })
    .then((dbData) => {
      if (dbData === 0) {
        res.status(404).json({ message: "No feed found with this id" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server delete feed error" });
    });
});

module.exports = router;
