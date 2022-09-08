const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");
const spawnWorkers = require("../utils/worker");

class Feed extends Model {
  static getAll(req, models) {
    return models.UserFeed.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: [
        [dbconn.col("Feed.id"), "id"],
        [dbconn.col("Feed.url"), "url"],
        "description",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: models.Feed,
          attributes: [],
        },
      ],
    });
  }
  static propogateCreate(req, models) {
    return models.Feed.findOrCreate({
      where: { url: req.body.url },
      defaults: { url: req.body.url },
    }).then(([dbData, created]) => {
      const feed = dbData.get({ plain: true });
      if (created) {
        spawnWorkers([feed], 0, models);
      } else {
        models.Article.findAll({
          where: { feed_id: feed.id },
        }).then((dbData) => {
          const articles = dbData.map((article) => ({
            article_id: article.get({ plain: true }).id,
            user_id: req.session.user_id,
            unread: true,
          }));
          models.UserArticle.bulkCreate(articles, {});
        });
      }
      return models.UserFeed.findOrCreate({
        where: {
          user_id: req.session.user_id,
          feed_id: feed.id,
        },
        defaults: {
          user_id: req.session.user_id,
          feed_id: feed.id,
          description: req.body.description,
        },
      });
    });
  }
  static async propogateDelete(req, models) {
    let dbData = await models.UserFeed.destroy({
      where: {
        user_id: req.session.user_id,
        feed_id: req.params.id,
      },
    });

    if (!dbData) {
      return 0;
    }

    dbData = await models.UserFeed.findOne({
      where: {
        feed_id: req.params.id,
      },
    });

    if (dbData) {
      dbData = await models.UserArticle.findAll({
        where: {
          user_id: req.session.user_id,
          "$article.feed.id$": req.params.id,
        },
        include: [
          {
            model: models.Article,
            include: [
              {
                model: models.Feed,
                attributes: ["id"],
                as: "feed",
              },
            ],
          },
        ],
      });
      await dbData.forEach((x) => x.destroy());
      return 1;
    } else {
      dbData = await models.Feed.destroy({
        where: {
          id: req.params.id,
        },
      });
      return 1;
    }
  }
}

Feed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        // make sure it is a url
        isUrl: true,
        // make sure it is between 1 and 2048 characters long
        len: [1, 2048],
      },
    },
  },
  {
    // todo: might need hooks?
    sequelize: dbconn,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "feed",
  }
);

module.exports = Feed;
