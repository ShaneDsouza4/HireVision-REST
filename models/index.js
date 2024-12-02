const Sequelize = require("sequelize");
const config = require("../config/config.js");
const environment = process.env.NODE_ENV;

const dbConfig = config[environment];

// Initializing Sequelize with environment configuration
let sequelize;
try {
  if (dbConfig.use_env_variable) {
    //Database URL pull from production
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
    });
  } else {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port || 5432,
        dialectOptions: dbConfig.dialectOptions,
      }
    );
  }
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Failed to connect to the database:", err.message);
  process.exit(1); //DB connection failure exit
}

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
