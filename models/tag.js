"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Many-to-Many with Interview through InterviewTag
      Tag.belongsToMany(models.Interview, {
        through: models.InterviewTag, // Specify the join table model here
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
      underscored: true,
      timestamps: true,
    }
  );

  return Tag;
};
