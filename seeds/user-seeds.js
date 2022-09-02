const { User } = require("../models");

const UserData = [
  {
    username: "ali",
    email: "blah@blah.com",
    password: "12345678",
  },
  {
    username: "bob",
    email: "boo@blah.com",
    password: "87654321",
  },
];

const seedUser = () => User.bulkCreate(UserData);

module.exports = seedUser;
