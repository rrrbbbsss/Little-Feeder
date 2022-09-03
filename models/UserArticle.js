const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");

class UserArticle extends Model {
  // todo: may need to add some static or instance methods later...
}

UserArticle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "article",
        key: "id",
      },
    },
    unread: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // todo: might need hooks?
    sequelize: dbconn,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "userArticle",
  }
);

module.exports = UserArticle;
