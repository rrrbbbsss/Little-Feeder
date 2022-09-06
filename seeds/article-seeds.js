const { Article } = require("../models");

const Data = [
  {
    title: "blah",
    published: "2022-09-06T03:15:10.000Z",
    url: "https://blah.blah.com",
    feed_id: 1,
  },
  {
    title: "what",
    published: "2022-09-06T03:15:10.000Z",
    url: "https://what.what.com",
    feed_id: 1,
  },
  {
    title: "asdf",
    published: "2022-09-06T03:15:10.000Z",
    url: "https://asdf.asdf.com",
    feed_id: 2,
  },
];

const seedArticle = () => Article.bulkCreate(Data);

module.exports = seedArticle;
