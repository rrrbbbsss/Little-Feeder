const router = require("express").Router();
const { User } = require("../../models");
const { PUB, AAA } = require("../../utils/auth");

//////////////////////////////////////////////////////
//////////////// User API routes: ////////////////////
//////////////////////////////////////////////////////
//
// description: create new user
// path: /api/user
// method: POST
// body: {
//   "username": "asdf",
//   "email": "blah@blah.com",
//   "password": "asdfasdf"
// }
//
//////////////////////////////////////////////////////
//
// description: login the user
// path: /api/user/login
// method: POST
// body: {
//   "email": "blah@blah.com",
//   "password": "asdfasdf"
// }
//
//////////////////////////////////////////////////////
//
// description: logout the user
// path: /api/user/logout
// method: POST
// body: {
// }
//
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// GET /api/user (read all users)
// not needed for app right now...

// GET /api/user/:id (read single user)
// not needed for app right now...

// PUT /api/user/:id (update user)
// not needed for app right now...

// DELETE /api/user/:id  (delete user)
// not needed for app night now...

function loginUser(req, res, dbData, message) {
  req.session.save(() => {
    req.session.user_id = dbData.id;
    req.session.username = dbData.username;
    req.session.loggedIn = true;
    res.json({ message: message });
  });
}

// POST /api/user (create new user)
router.post("/", PUB, (req, res) => {
  // expects: { username: "blah", email: "blah@blah.com", password: "asdfasdf"}
  // todo: better messaging of errors
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbData) => {
      loginUser(req, res, dbData, "User Created");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server user creation error" });
    });
});

// POST /api/user/login (login user)
router.post("/login", PUB, (req, res) => {
  // expects: { email: "blah@blah.com", password: "asdfasdf"}
  // todo: better messaging of errors
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((dbData) => {
      // verify user
      if (!dbData) {
        res.status(400).json({ message: "Invalid Credentials" });
        return;
      }
      // verify password
      const validPassword = dbData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect Password for user" });
        return;
      }
      //login user
      loginUser(req, res, dbData, "User logged In");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server login error" });
    });
});

// POST /api/user/logout (logout user)
router.post("/logout", AAA, (req, res) => {
  // expects: {}
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
