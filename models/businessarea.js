"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BusinessArea extends Model {
    static associate(models) {
      // One-to-Many with Interview
      BusinessArea.hasMany(models.Interview, {
        foreignKey: "business_area",
        as: "interviews", // Alias for interviews under this business area
      });

      // One-to-Many with Interviewer
      BusinessArea.hasMany(models.Interviewer, {
        foreignKey: "business_area_id",
        as: "interviewers", // Alias for interviewers under this business area
      });
    }
  }

  BusinessArea.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
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
      modelName: "BusinessArea",
      underscored: true, // Use snake_case in the DB
      timestamps: true,
    }
  );

  return BusinessArea;
};
