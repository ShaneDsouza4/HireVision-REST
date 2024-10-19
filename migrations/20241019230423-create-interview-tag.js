"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InterviewTags", {
      tag_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Tags",
          key: "id",
        },
        onDelete: "CASCADE", // Ensure related records are removed on delete
      },
      interview_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Interviews",
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("InterviewTags");
  },
};
