const router = require("express").Router();
const { Article, UserArticle, Feed, UserFeed } = require("../../models");
const dbconn = require("../../config/connection");
const { PUB, AAA } = require("../../utils/auth");

//////////////////////////////////////////////////////
///////////// Article API routes: ////////////////////
//////////////////////////////////////////////////////
//
// description: get articles (of the requesting user)
// path: /api/article
// method: GET
//
//////////////////////////////////////////////////////
//
// description: mark article as unread/read
// path: /api/article/id
// method: PUT
// body: { "unread": false }
//
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// GET /api/article
// todo: redo this...
// todo: better error messaging
router.get("/", AAA, (req, res) => {
  UserArticle.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["unread"],
    include: [
      {
        model: Article,
        attributes: ["id", "title", "published", "url"],
        include: [
          {
            model: Feed,
            attributes: ["id", "url"],
            include: [{ model: UserFeed, attributes: ["description"] }],
          },
        ],
      },
    ],
  })
    .then((dbData) => {
      const feeds = dbData.map((feed) => feed.get({ plain: true }));
      res.json(feeds);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server get articles error" });
    });
});

// PUT /api/article/:id
// todo: better error messaging
router.put("/:id", AAA, (req, res) => {
  // expects: { unread: "asdf" }
  // todo: validate body before attempting to update feed
  UserArticle.update(
    {
      unread: req.body.unread,
    },
    {
      where: {
        user_id: req.session.user_id,
        article_id: req.params.id,
      },
    }
  )
    .then((dbData) => {
      // todo: if it doens't find resource, return a better status
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server put article error" });
    });
});

module.exports = router;
