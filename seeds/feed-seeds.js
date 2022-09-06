const { Feed } = require("../models");

const Data = [
  {
    url: "http://www.reddit.com/.rss",
  },
  {
    url: "http://www.reddit.com/r/news/.rss",
  },
];

const seedFeed = () => Feed.bulkCreate(Data);

module.exports = seedFeed;
