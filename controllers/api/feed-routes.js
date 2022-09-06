const router = require("express").Router();
const { User, Feed, UserFeed, Article, UserArticle } = require("../../models");
const dbconn = require("../../config/connection");
const { PUB, AAA } = require("../../utils/auth");
const { valCheck } = require("../../utils/validate");
const { body } = require("express-validator");

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
const r_get = () => {
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
};

// GET /api/feed/:id
const r_getId = () => {
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
          res
            .status(404)
            .json({ message: "No feed found with this id for this user" });
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
};

// POST /api/feed
const r_post = () => {
  const valRules = [
    body("url")
      .exists()
      .withMessage("url must be supplied")
      .isURL({ protocols: ["http", "https"] })
      .withMessage("url must be a valid url"),
    body("description")
      .exists()
      .withMessage("description must be supplied")
      .trim()
      .isLength({ max: 2048 })
      .withMessage("description must be at max 2048 char long"),
  ];
  router.post("/", AAA, valRules, valCheck, (req, res) => {
    Feed.propogateCreate(req, { Feed, UserFeed, Article, UserArticle })
      .then(([dbData, created]) => {
        const { feed_id, description, createdAt } = dbData.get({ plain: true });
        const feed = { id: feed_id, description, createdAt };
        res.json(feed);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "server post feed error" });
      });
  });
};

// PUT /api/feed/:id
const r_putId = () => {
  const valRules = [
    body("description")
      .exists()
      .withMessage("description must be supplied")
      .trim()
      .isLength({ max: 2048 })
      .withMessage("description must be at max 2048 char long"),
  ];
  router.put("/:id", AAA, valRules, valCheck, (req, res) => {
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
};

// DELETE /api/feed/:id
const r_deleteId = () => {
  router.delete("/:id", AAA, (req, res) => {
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
};

r_get();
r_getId();
r_post();
r_putId();
r_deleteId();

module.exports = router;
