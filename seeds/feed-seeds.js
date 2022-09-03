const { Feed } = require("../models");

const Data = [
  {
    url: "https://blah.blah.com",
  },
  {
    url: "https://what.what.com",
  },
];

const seedFeed = () => Feed.bulkCreate(Data);

module.exports = seedFeed;
