const Models = require("../models");
const spawnWorkers = require("./worker");

const defaultOneDay = 60 * 60 * 24;
require("dotenv").config();
let SCHEDWK = (process.env.SCHEDWK || defaultOneDay) * 1000;

const getFeeds = async () => {
  let dbData = await Models.Feed.findAll();
  return dbData.map((feed) => feed.get({ plain: true }));
};

const schedule = async () => {
  const feeds = await getFeeds();
  // if there are no feeds, there is nothing to do
  if (feeds.length === 0) {
    return;
  }
  // calculate the interval to grab each feed within the day
  const feedInterval = Math.floor(SCHEDWK / feeds.length);
  //spawnWorkers(feeds, feedInterval);
  spawnWorkers(feeds, feedInterval, Models);
};

const scheduleWorker = () => {
  setInterval(schedule, SCHEDWK);
};

module.exports = scheduleWorker;
