const router = require("express").Router();
const { Article, UserArticle, Feed, UserFeed, User } = require("../../models");
const dbconn = require("../../config/connection");
const { PUB, AAA } = require("../../utils/auth");
const { valCheck } = require("../../utils/validate");
const { query, body } = require("express-validator");

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
const r_get = () => {
  const valRules = [
    query("unread")
      .optional()
      .isIn(["true", "false"])
      .withMessage("unread query must be true or false"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page query must be positive number"),
  ];
  router.get("/", AAA, valRules, valCheck, (req, res) => {
    const offset = (req.query.page - 1 || 0) * 100;
    const unread = req.query.unread
      ? req.query.unread === "true"
      : [true, false];
    Article.findAll({
      offset: offset,
      limit: 100,
      attributes: ["id", "title", "published", "url"],
      order: [["published", "DESC"]],
      include: [
        {
          model: UserArticle,
          attributes: ["unread"],
          required: true,
          where: {
            user_id: req.session.user_id,
            unread: unread,
          },
        },
        {
          model: Feed,
          attributes: ["id", "url"],
          include: [
            {
              model: UserFeed,
              attributes: ["description"],
              where: {
                user_id: req.session.user_id,
              },
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
        const pages = Math.ceil(count / 100);
        res.json({ count, pages, articles });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "server get articles error" });
      });
  });
};

// PUT /api/article/:id
const r_putId = () => {
  const valRules = [
    body("unread")
      .exists()
      .withMessage("unread must be supplied")
      .isIn([true, false])
      .withMessage("unread query must be true or false"),
  ];
  router.put("/:id", AAA, valRules, valCheck, (req, res) => {
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
        res.json(dbData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "server put article error" });
      });
  });
};

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

r_get();
r_putId();

module.exports = router;
