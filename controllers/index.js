const router = require("express").Router();
const apiRoutes = require("./api");
const loginRoutes = require("./login-routes");
const signupRoutes = require("./signup-routes");
const articleRoutes = require("./article-routes");
const feedRoutes = require("./feed-routes");
const homeRoutes = require("./home-routes");

router.use("/api", apiRoutes);
router.use("/login", loginRoutes);
router.use("/signup", signupRoutes);
router.use("/article", articleRoutes);
router.use("/feed", feedRoutes);
router.use("/", homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
