const Sequelize = require("sequelize");
const config = require("../config/config.js"); // Adjust if config.js is located elsewhere

// Initialize Sequelize with environment configuration
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

// Import all models
const Interviewer = require("./interviewer")(sequelize, Sequelize.DataTypes);
const Interview = require("./interview")(sequelize, Sequelize.DataTypes);
const Interviewee = require("./interviewee")(sequelize, Sequelize.DataTypes);
const BusinessArea = require("./businessarea")(sequelize, Sequelize.DataTypes);
const Job = require("./job")(sequelize, Sequelize.DataTypes);
const Tag = require("./tag")(sequelize, Sequelize.DataTypes);
const InterviewTag = require("./interviewtag")(sequelize, Sequelize.DataTypes);

// Setup model associations
const models = {
  Interviewer,
  Interview,
  Interviewee,
  BusinessArea,
  Job,
  Tag,
  InterviewTag,
};

// Call associate methods (if defined) to set up associations dynamically
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export Sequelize instance and models
module.exports = {
  sequelize,
  ...models,
};
