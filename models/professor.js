const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Professor = sequelize.define(
  "Professor",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Anonymous",
    },
    HashPassword: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "123456",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Professor;
