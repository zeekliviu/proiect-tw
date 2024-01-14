const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    Username: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    Calitate: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
