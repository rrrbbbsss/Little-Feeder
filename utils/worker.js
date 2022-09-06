const { Article } = require("../models");

// with CommonJS environments
const { read } = require('feed-reader/dist/cjs/feed-reader.js')
async function worker (feed) {
  const articles = await read(feed.url) 
  console.log(articles)
  return articles.entries
}


spawnWorkers = async (feeds, feedInterval) => {
  if (feeds.length === 0) {
    return;
  } else {
    [head, ...tail] = feeds;
    const articles = await worker(head);
    //Article.propogateBulkCreate(articles, head.id, Models);
    console.log("updated feed articles: ", head);
    setTimeout(() => {
      spawnWorkers(tail, feedInterval);
    }, feedInterval);
  }
};

module.exports = spawnWorkers;
