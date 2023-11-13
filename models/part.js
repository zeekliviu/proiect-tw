const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Part = sequelize.define(
  "Part",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Link: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Video: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Part;
