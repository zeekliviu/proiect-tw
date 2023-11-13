const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TeamID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "The Nameless Project",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Project;
