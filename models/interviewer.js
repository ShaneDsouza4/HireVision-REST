"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Interviewer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-Many with Interview
      Interviewer.belongsToMany(models.Interview, {
        through: "Interview_Interviewers", // Join table
        foreignKey: "interviewer_id",
      });

      // Many-to-One with BusinessArea
      Interviewer.belongsTo(models.BusinessArea, {
        foreignKey: "business_area_id",
        as: "business_area",
      });
    }
  }

  Interviewer.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      business_area_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Auto-generate current timestamp
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Auto-generate current timestamp
      },
    },
    {
      sequelize,
      modelName: "Interviewer",
      // Ensure Sequelize uses snake_case in the DB
      underscored: true,
      timestamps: true,
    }
  );

  return Interviewer;
};
