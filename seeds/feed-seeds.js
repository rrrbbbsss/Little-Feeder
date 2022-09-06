const { Feed } = require("../models");

const Data = [
  {
    url: "http://www.reddit.com/.rss",
  },
  {
    url: "http://www.reddit.com/r/news/.rss",
  },
  {
    url: "https://bad.on.purpose.bla",
  },
];

const seedFeed = () => Feed.bulkCreate(Data);

module.exports = seedFeed;
