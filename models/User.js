const { Model, DataTypes } = require("sequelize");
const dbconn = require("../config/connection");
const bcrypt = require("bcrypt");

async function hashPassword(UserData) {
  UserData.password = await bcrypt.hash(UserData.password, 10);
  return UserData;
}

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        // usernames can only be alphanumerics
        isEmail: true,
        // make sure it is between 1 and 255 characters long
        len: [1, 255],
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    hooks: {
      // hash passwords hooks
      beforeCreate: hashPassword,
      beforeBulkCreate: async (arr) => {
        for (let user of arr) {
          user.dataValues = await hashPassword(user.dataValues);
        }
        return arr;
      },
      beforeUpdate: hashPassword,
    },
    sequelize: dbconn,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
