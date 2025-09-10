const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Tip",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "tips", timestamps: false }
  );
