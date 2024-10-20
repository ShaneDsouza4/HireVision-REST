"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    static associate(models) {
      // Many-to-One with BusinessArea (alias added to avoid naming collision)
      Interview.belongsTo(models.BusinessArea, {
        foreignKey: "business_area",
        as: "businessArea",
      });

      // Many-to-One with Job
      Interview.belongsTo(models.Job, { foreignKey: "job" });

      // One-to-One with Interviewee
      Interview.belongsTo(models.Interviewee, { foreignKey: "interviewee" });

      // Many-to-Many with Interviewer through interview_interviewers join table
      Interview.belongsToMany(models.Interviewer, {
        through: "interview_interviewers", // Ensure this join table exists in your migrations
        foreignKey: "interview_id",
      });

      // Many-to-Many with Tag through InterviewTag join table
      Interview.belongsToMany(models.Tag, {
        through: models.InterviewTag, // Make sure InterviewTag model exists and is defined
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
        type: DataTypes.ARRAY(DataTypes.UUID), // Array of UUIDs for interviewers
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
