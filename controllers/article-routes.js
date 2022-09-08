const router = require("express").Router();
const dbconn = require("../config/connection");
const { PUB, AAA, PAA } = require("../utils/auth");
const { Article, UserArticle, Feed, UserFeed } = require("../models");

router.get("/", PAA, async (req, res) => {
  const dbData = await Article.findAll({
    offset: 0,
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
          unread: true,
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
  });
  const articles = dbData.map((article) => article.get({ plain: true }));
  const count = await UserArticle.count({
    where: { user_id: req.session.user_id, unread: true },
  });
  const pages = Math.ceil(count / 100);
  res.render("article", {
    loggedIn: req.session.loggedIn,
    articlePage: true,
    articles,
    pages,
  });
});

module.exports = router;
