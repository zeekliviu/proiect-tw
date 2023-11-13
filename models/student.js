const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "Student",
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
    TeamID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Student;
