const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Jury = sequelize.define(
  "Jury",
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
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Jury;
