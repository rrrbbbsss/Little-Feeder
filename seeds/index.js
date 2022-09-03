const seedUser = require("./user-seeds");
const seedFeed = require("./feed-seeds");
const seedUserFeed = require("./userFeed-seeds");
const seedArticle = require("./article-seeds");
const seedUserArticle = require("./userArticle-seeds");
const dbconn = require("../config/connection");

const seedAll = async () => {
  await dbconn.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");

  await seedUser();
  console.log("\n----- USER SEEDED -----\n");

  await seedFeed();
  console.log("\n----- FEED SEEDED -----\n");

  await seedUserFeed();
  console.log("\n----- USER FEED SEEDED -----\n");

  await seedArticle();
  console.log("\n----- ARTICLE SEEDED -----\n");

  await seedUserArticle();
  console.log("\n----- USER ARTICLE SEEDED -----\n");

  process.exit(0);
};

seedAll();
