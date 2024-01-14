const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Grade = sequelize.define(
  "Grade",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PartID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Grade: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    Who: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LastWhen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Grade;
