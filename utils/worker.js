const { read } = require("feed-reader/dist/cjs/feed-reader.js");
var validator = require("validator");

const worker = async (feed) => {
  try {
    const articles = await read(feed.url);
    const { entries } = articles;
    const formatedArticles = entries.map(({ title, link, published }) => ({
      feed_id: feed.id,
      title,
      url: link,
      published: validator.toDate(published),
    }));
    return formatedArticles;
  } catch (err) {
    console.log("\n-----\n", "worker error: ", err, "\n-----\n");
    return [];
  }
};

const spawnWorkers = async (feeds, feedInterval, models) => {
  if (feeds.length === 0) {
    return;
  } else {
    [head, ...tail] = feeds;
    const articles = await worker(head);
    await models.Article.propogateBulkCreate(articles, head.id, models);
    console.log("updated feed articles: ", head);
    setTimeout(() => {
      spawnWorkers(tail, feedInterval, models);
    }, feedInterval);
  }
};

module.exports = spawnWorkers;
