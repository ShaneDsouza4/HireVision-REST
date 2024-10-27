const Sequelize = require("sequelize");
const config = require("../config/config.js");

// Initializing Sequelize with environment configuration
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

const Interviewer = require("./interviewer")(sequelize, Sequelize.DataTypes);
const Interview = require("./interview")(sequelize, Sequelize.DataTypes);
const Interviewee = require("./interviewee")(sequelize, Sequelize.DataTypes);
const BusinessArea = require("./businessarea")(sequelize, Sequelize.DataTypes);
const Job = require("./job")(sequelize, Sequelize.DataTypes);
const Tag = require("./tag")(sequelize, Sequelize.DataTypes);
const InterviewTag = require("./interviewtag")(sequelize, Sequelize.DataTypes);

// Model associations
const models = {
  Interviewer,
  Interview,
  Interviewee,
  BusinessArea,
  Job,
  Tag,
  InterviewTag,
};

// Associate methods to set up associations dynamically
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
