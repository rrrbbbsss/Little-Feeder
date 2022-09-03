const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");

class Article extends Model {
  // todo: may need to add some static or instance methods later...
}

Article.init(
  {
    id: {
      // todo: maybe make the primary key be the hash of the values of the other coloumns
      //       (make checking to add a new article easier (so we don't add duplicates))
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      // todo: we might need to tweak this to be longer
      type: DataTypes.STRING,
      // title might be null...
      allowNull: true,
      validate: {
        // make sure it is between 0 and 2048 characters long
        len: [0, 255],
      },
    },
    published: {
      // todo: this will be some sort of date string so maybe a different type?
      type: DataTypes.STRING,
      // might not have a published date...
      allowNull: true,
      validate: {
        // todo: make sure it some timestamp
        // make sure it is between 1 and 2048 characters long
        len: [1, 2048],
      },
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
  },
  {
    // todo: might need hooks?
    sequelize: dbconn,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "article",
  }
);

module.exports = Article;
