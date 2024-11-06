"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Interviewer extends Model {
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
        unique: true, // Ensure email is unique
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      business_area_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      employee_id: {
        type: DataTypes.STRING, // Change to appropriate type as needed
        allowNull: false,
        unique: true, // Ensure employee ID is unique
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // Store the hashed password
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
      underscored: true,
      timestamps: true,
    }
  );

  return Interviewer;
};
