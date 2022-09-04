const { Article } = require("../models");

spawnWorkers = async (feeds, feedInterval) => {
  if (feeds.length === 0) {
    return;
  } else {
    [head, ...tail] = feeds;
    //const articles = await worker(head);
    //Article.propogateBulkCreate(articles, head.id, Models);
    console.log("updated feed articles: ", head);
    setTimeout(() => {
      spawnWorkers(tail, feedInterval);
    }, feedInterval);
  }
};

module.exports = spawnWorkers;
