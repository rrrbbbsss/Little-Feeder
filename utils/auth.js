const PUB = (req, res, next) => {
  //just let it pass through
  next();
};

const PAA = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    // todo: authroization, accounting, auditing...
    next();
  }
};

const AAA = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.status(403).json({ message: "Unauthorized to Access" });
  } else {
    // todo: authroization, accounting, auditing...
    next();
  }
};

module.exports = { PUB, PAA, AAA };
