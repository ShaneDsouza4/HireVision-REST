"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interviewers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Auto-generate UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure email uniqueness
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      business_area_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "business_areas", // Ensure this matches the name of the BusinessArea table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      employee_id: {
        type: Sequelize.STRING, // Field for Employee ID
        allowNull: false,
        unique: true, // Ensure employee ID is unique
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // Field for storing hashed password
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Auto-set to current timestamp
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Auto-set to current timestamp
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("interviewers");
  },
};
