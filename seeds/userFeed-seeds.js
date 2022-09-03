const { UserFeed } = require("../models");

const Data = [
  {
    user_id: 1,
    feed_id: 1,
    description: "asdfasdfsadf",
  },
  {
    user_id: 1,
    feed_id: 2,
    description: "33kk3k 3kk2k2 k3k3k2",
  },
  // make sure this info is consistent
  // (user has a feed of the article...)
  {
    user_id: 2,
    feed_id: 2,
    description: "asdf asdfas df asdf",
  },
];

const seedUserFeed = () => UserFeed.bulkCreate(Data);

module.exports = seedUserFeed;
