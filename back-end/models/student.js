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
    Avatar: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: null,
    },
    Username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "Anonymous",
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    HashPassword: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    TeamID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    Verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    Jury: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Student;
