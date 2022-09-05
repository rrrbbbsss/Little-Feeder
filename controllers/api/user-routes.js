const router = require("express").Router();
const { User } = require("../../models");
const { PUB, AAA } = require("../../utils/auth");
const { valCheck } = require("../../utils/validate");
const { body } = require("express-validator");

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
const r_post = () => {
  const valRules = [
    body("username")
      .exists()
      .withMessage("username must be supplied")
      .isLength({ min: 1 })
      .withMessage("username must be at least 1 char long")
      .isLength({ max: 32 })
      .withMessage("username must be at max 32 chars long")
      .trim()
      .isAlphanumeric()
      .withMessage("username must be alphanumeris"),
    body("email")
      .exists()
      .withMessage("email must be supplied")
      .isEmail()
      .withMessage("email must be valid")
      .normalizeEmail(),
    body("password")
      .exists()
      .withMessage("password must be supplied")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 char long")
      .isLength({ max: 32 })
      .withMessage("password must be at max 32 char long"),
  ];
  router.post("/", PUB, valRules, valCheck, (req, res) => {
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
        if (err.errors[0].type === "unique violation") {
          res.status(409).json({ message: err.errors[0].message });
          return;
        }
        res.status(500).json({ message: "server user creation error" });
      });
  });
};

// POST /api/user/login (login user)
const r_postLogin = () => {
  const valRules = [
    body("email")
      .exists()
      .withMessage("email must be supplied")
      .isEmail()
      .withMessage("email must be valid")
      .normalizeEmail(),
    body("password")
      .exists()
      .withMessage("password must be supplied")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 char long")
      .isLength({ max: 32 })
      .withMessage("password must be at max 32 char long"),
  ];
  router.post("/login", PUB, valRules, valCheck, (req, res) => {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((dbData) => {
        // verify user
        if (!dbData) {
          res
            .status(400)
            .json({ message: "Invalid Email or Password for user" });
          return;
        }
        // verify password
        const validPassword = dbData.checkPassword(req.body.password);
        if (!validPassword) {
          res
            .status(400)
            .json({ message: "Invalid Email or Password for user" });
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
};

// POST /api/user/logout (logout user)
const r_postLogout = () => {
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
};

r_post();
r_postLogin();
r_postLogout();

module.exports = router;
