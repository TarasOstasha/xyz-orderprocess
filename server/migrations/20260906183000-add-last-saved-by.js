'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notes', 'last_saved_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('steps', 'last_saved_by', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('notes', 'last_saved_by');
    await queryInterface.removeColumn('steps', 'last_saved_by');
  },
};
