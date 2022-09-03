const { UserArticle } = require("../models");

const Data = [
  {
    user_id: 1,
    article_id: 1,
    unread: true,
  },
  {
    user_id: 1,
    article_id: 2,
    unread: false,
  },
  // make sure this info is consistent
  // (user has a feed of the article...)
  {
    user_id: 2,
    article_id: 3,
    unread: true,
  },
];

const seedUserArticle = () => UserArticle.bulkCreate(Data);

module.exports = seedUserArticle;
