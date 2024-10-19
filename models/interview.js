"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    static associate(models) {
      // Many-to-One with BusinessArea
      Interview.belongsTo(models.BusinessArea, {
        foreignKey: "business_area",
        as: "business_area",
      });

      // Many-to-One with Job
      Interview.belongsTo(models.Job, {
        foreignKey: "job",
        as: "job",
      });

      // One-to-One with Interviewee
      Interview.belongsTo(models.Interviewee, {
        foreignKey: "interviewee",
        as: "interviewee",
      });

      // Many-to-Many with Interviewer
      Interview.belongsToMany(models.Interviewer, {
        through: "Interview_Interviewers",
        foreignKey: "interview_id",
      });

      // Many-to-Many with Tag through InterviewTag
      Interview.belongsToMany(models.Tag, {
        through: models.InterviewTag,
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
