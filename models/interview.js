"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    static associate(models) {
      // Define associations here
      Interview.belongsTo(models.BusinessArea, { foreignKey: "business_area" });
      Interview.belongsTo(models.Job, { foreignKey: "job" });
      Interview.belongsTo(models.Interviewee, { foreignKey: "interviewee" });
      Interview.belongsToMany(models.Interviewer, {
        through: "interview_interviewers",
        foreignKey: "interview_id",
      });
    }
  }

  Interview.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      interviewer: {
        type: DataTypes.ARRAY(DataTypes.UUID), // Array of UUIDs
        allowNull: false,
      },
      business_area: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      job: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      date_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      interviewee: {
        type: DataTypes.UUID,
        allowNull: true,
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
      modelName: "Interview",
      underscored: true, // Use snake_case in the DB
      timestamps: true,
    }
  );

  return Interview;
};
