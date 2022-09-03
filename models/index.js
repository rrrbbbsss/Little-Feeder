const User = require("./User");
const Feed = require("./Feed");
const Article = require("./Article");
const UserFeed = require("./UserFeed");
const UserArticle = require("./UserArticle");

// Article *<--->1 Feed
Feed.hasMany(Article, {
  foreignKey: "feed_id",
});
Article.belongsTo(Feed, {
  foreignKey: "feed_id",
});

// User *<--(UserFeed)-->* Feed
User.belongsToMany(Feed, {
  through: UserFeed,
  as: "feeds",
  foreignKey: "user_id",
});
Feed.belongsToMany(User, {
  through: UserFeed,
  as: "feeds",
  foreignKey: "feed_id",
});
UserFeed.belongsTo(User, {
  foreignKey: "user_id",
});
UserFeed.belongsTo(Feed, {
  foreignKey: "feed_id",
});
User.hasMany(UserFeed, {
  foreignKey: "user_id",
});
Feed.hasMany(UserFeed, {
  foreignKey: "feed_id",
});

// User *<--(UserArticle)-->* Article
User.belongsToMany(Article, {
  through: UserArticle,
  as: "articles",
  foreignKey: "user_id",
});
Article.belongsToMany(User, {
  through: UserArticle,
  as: "articles",
  foreignKey: "article_id",
});
UserArticle.belongsTo(User, {
  foreignKey: "user_id",
});
UserArticle.belongsTo(Article, {
  foreignKey: "article_id",
});
User.hasMany(UserArticle, {
  foreignKey: "user_id",
});
Article.hasMany(UserArticle, {
  foreignKey: "article_id",
});

module.exports = { User, Feed, UserFeed, Article, UserArticle };
