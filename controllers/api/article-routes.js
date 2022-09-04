const router = require("express").Router();
const { Article, UserArticle, Feed, UserFeed, User } = require("../../models");
const dbconn = require("../../config/connection");
const { Op } = require("sequelize");
const { PUB, AAA } = require("../../utils/auth");

//////////////////////////////////////////////////////
///////////// Article API routes: ////////////////////
//////////////////////////////////////////////////////
//
// description: get articles (of the requesting user)
// path: /api/article?page=1&unread=true
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
// todo: better error messaging
router.get("/", AAA, (req, res) => {
  //todo validate queries
  const offset = (req.query.page || 0) * 100;
  const unread = req.query.unread ? req.query.unread === "true" : [true, false];
  //  const
  UserArticle.findAll({
    offset: offset,
    limit: 100,
    // todo: sort by published date...
    where: {
      user_id: req.session.user_id,
      unread: unread,
    },
    attributes: ["unread"],
    include: [
      {
        model: Article,
        attributes: ["id", "title", "published", "url"],
        include: [
          {
            model: Feed,
            as: "feed",
            attributes: ["id", "url"],
            include: [{ model: UserFeed, attributes: ["description"] }],
          },
        ],
      },
    ],
  })
    .then(async (dbData) => {
      const articles = dbData.map((article) => article.get({ plain: true }));
      const count = await UserArticle.count({
        where: { user_id: req.session.user_id, unread: unread },
      });
      res.json({ count, pages: Math.ceil(count / 100), articles });
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

// for testing:
//router.post("/", PUB, (req, res) => {
//  Article.propogateBulkCreate(req.body.articles, req.body.feed_id, {
//    Article,
//    UserArticle,
//    Feed,
//    UserFeed,
//  })
//    .then((dbData) => {
//      res.json(dbData);
//    })
//    .catch((err) => {
//      console.log(err);
//      res.status(500).json({ message: "server post article error" });
//    });
//});

module.exports = router;
