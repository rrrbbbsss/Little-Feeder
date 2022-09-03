const PUB = (req, res, next) => {
  //just let it pass through
  next();
};

const AAA = (req, res, next) => {
  if (!req.session.loggedIn) {
    // leave this out for now..
    // res.redirect("/login");
    console.log("todo: require authentication");
    next();
  } else {
    // todo: authroization, accounting, auditing...
    next();
  }
};

module.exports = { PUB, AAA };
