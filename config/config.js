require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL", //Sequelize will fetch varaible
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, //For SS:
        rejectUnauthorized: false, // For managed databases Render, DO NOT REMOVE
      },
    },
  },
};
