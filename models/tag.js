"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Define associations here, if needed
      Tag.belongsToMany(models.Interview, {
        through: "interview_tag",
        foreignKey: "tag_id",
      });
    }
  }

  Tag.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      underscored: true, // Use snake_case in the DB
      timestamps: true,
    }
  );

  return Tag;
};
