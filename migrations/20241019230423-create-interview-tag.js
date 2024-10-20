"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interview_tags", {
      // Changed to snake_case
      tag_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tags", // Ensure the model name is in lowercase
          key: "id",
        },
        onDelete: "CASCADE", // Ensure related records are removed on delete
      },
      interview_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "interviews", // Ensure the model name is in lowercase
          key: "id",
        },
        onDelete: "CASCADE",
      },
      date_time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("interview_tags"); // Changed to snake_case
  },
};
