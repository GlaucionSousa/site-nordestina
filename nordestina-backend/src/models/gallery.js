const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Gallery",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      url: { type: DataTypes.STRING, allowNull: false }, // path or URL
      alt: { type: DataTypes.STRING, allowNull: true },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "gallery", timestamps: false }
  );
