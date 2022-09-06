const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");
const crypto = require("crypto");

const sha256 = (str) => {
  return crypto.createHash("sha256").update(str).digest("base64");
};

const hashEntry = (ArticleData) => {
  const { title, published, url, feed_id } = ArticleData;
  const str = title.concat(published).concat(url).concat(feed_id);
  ArticleData.hash = sha256(str);
  return ArticleData;
};

class Article extends Model {
  static async propogateBulkCreate(articleArray, feed_id, models) {
    let dbData;
    // bulkcreate the articles
    dbData = await models.Article.bulkCreate(articleArray, {
      ignoreDuplicates: true,
      validate: true,
    });
    const newArticles = dbData.reduce(
      (acc, x) => (x.id ? [{ article_id: x.id }].concat(acc) : acc),
      []
    );
    dbData = await models.UserFeed.findAll({
      where: { feed_id: feed_id },
      attributes: ["user_id"],
    });
    const users = dbData.map((user) => user.get({ plain: true }));
    // userArticleArray is cartesian product of user array and new articles array
    const userArticleArray = users
      .map(({ user_id }) =>
        newArticles.map(({ article_id }) => ({
          user_id,
          article_id,
          unread: true,
        }))
      )
      .flat();
    // bulkcreate the userarticles
    dbData = await models.UserArticle.bulkCreate(userArticleArray, {});
    return { message: "success" };
  }
}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      // title might be null...
      allowNull: true,
      validate: {
        // make sure it is between 0 and 2048 characters long
        len: [0, 2048],
      },
    },
    published: {
      type: DataTypes.DATE,
      // might not have a published date...
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // make sure it is a rul
        isUrl: true,
        // make sure it is between 1 and 2048 characters long
        len: [1, 2048],
      },
    },
    feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "feed",
        key: "id",
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    hooks: {
      // hash row hooks
      beforeCreate: hashEntry,
      beforeBulkCreate: (arr) => {
        for (let user of arr) {
          user.dataValues = hashEntry(user.dataValues);
        }
        return arr;
      },
      beforeUpdate: hashEntry,
    },
    sequelize: dbconn,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "article",
  }
);

module.exports = Article;
