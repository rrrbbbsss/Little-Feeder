const seedUser = require("./user-seeds");
//const seedPost = require("./post-seeds");
//const seedComment = require("./article-seeds");
const dbconn = require("../config/connection");

const seedAll = async () => {
  await dbconn.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");

  await seedUser();
  console.log("\n----- USER SEEDED -----\n");

  //await seedPost();
  //console.log("\n----- POST SEEDED -----\n");

  //await seedComment();
  //console.log("\n----- COMMENT TAGS SEEDED -----\n");

  process.exit(0);
};

seedAll();
