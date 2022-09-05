const { validationResult } = require("express-validator");

// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const valCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errormsg = errors.errors[0].msg;
  // just return the first
  return res.status(400).json({ message: errormsg });
};

module.exports = { valCheck };
