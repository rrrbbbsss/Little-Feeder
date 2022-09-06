/* var mysql = require("mysql2/promise");

require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const db = mysql.createConnection({
  host: "localhost",
  user: DB_USER,
  password: DB_PASS,
});

const schema = async () => {
  const conn = await db;
  await conn.query("DROP DATABASE IF EXISTS " + DB_NAME);
  await conn.query("CREATE DATABASE " + DB_NAME);
  console.log("\n----- DB CREATED -----\n");

  process.exit(0);
};

schema(); */
