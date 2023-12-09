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
    Verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Professor;
