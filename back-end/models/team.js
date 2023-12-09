const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Team = sequelize.define(
  "Team",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "No Team",
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Team;
