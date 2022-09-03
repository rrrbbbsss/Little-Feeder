const router = require("express").Router();
const userRoutes = require("./user-routes.js");
const feedRoutes = require("./feed-routes.js");
const articleRoutes = require("./article-routes.js");

router.use("/user", userRoutes);
router.use("/feed", feedRoutes);
router.use("/article", articleRoutes);

module.exports = router;
