'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notes', 'critical_saved_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('notes', 'general_saved_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('notes', 'art_saved_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Do not copy last_saved_by into all fields — that incorrectly marks
    // every note as saved by the same person.
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('notes', 'critical_saved_by');
    await queryInterface.removeColumn('notes', 'general_saved_by');
    await queryInterface.removeColumn('notes', 'art_saved_by');
  },
};
