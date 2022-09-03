const { Article } = require("../models");

const Data = [
  {
    title: "blah",
    published: "todo: timestamp this",
    url: "https://blah.blah.com",
    feed_id: 1,
  },
  {
    title: "what",
    published: "todo: timestamp this",
    url: "https://what.what.com",
    feed_id: 1,
  },
  {
    title: "asdf",
    published: "todo: timestamp this",
    url: "https://asdf.asdf.com",
    feed_id: 2,
  },
];

const seedArticle = () => Article.bulkCreate(Data);

module.exports = seedArticle;
