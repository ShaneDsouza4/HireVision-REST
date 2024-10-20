"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InterviewTag extends Model {
    static associate(models) {
      // Associate InterviewTag with Tag and Interview models
      InterviewTag.belongsTo(models.Tag, { foreignKey: "tag_id" });
      InterviewTag.belongsTo(models.Interview, { foreignKey: "interview_id" });
    }
  }

  InterviewTag.init(
    {
      tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tags", // Ensure this matches the table name for Tag
          key: "id",
        },
        onDelete: "CASCADE", // Ensure cascading delete for relational integrity
      },
      interview_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Interviews", // Ensure this matches the table name for Interview
          key: "id",
        },
        onDelete: "CASCADE", // Ensure cascading delete for relational integrity
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
      modelName: "InterviewTag",
      underscored: true,
      timestamps: true,
    }
  );

  return InterviewTag;
};
