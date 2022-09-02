const Sequelize = require("sequelize");

require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_JAWS = process.env.JAWSDB_URL;
let sequelize;

if (DB_JAWS) {
  sequelize = new Sequelize(DB_JAWS);
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  });
}

module.exports = sequelize;
