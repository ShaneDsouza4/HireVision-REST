"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InterviewTag extends Model {
    static associate(models) {
      // Associations for the join table are not needed here
    }
  }

  InterviewTag.init(
    {
      tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tags", // Name of the Tag table
          key: "id",
        },
        onDelete: "CASCADE", // Cascade on delete
      },
      interview_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Interviews", // Name of the Interview table
          key: "id",
        },
        onDelete: "CASCADE", // Cascade on delete
      },
      date_time: {
        type: DataTypes.DATE,
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
      modelName: "InterviewTag",
      underscored: true, // Use snake_case in the DB
      timestamps: true,
    }
  );

  return InterviewTag;
};
