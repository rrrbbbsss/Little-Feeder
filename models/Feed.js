const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");

class Feed extends Model {
  // todo: may need to add some static or instance methods later...
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
        // make sure it is a rul
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
