'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('steps', 'date', {
      type: Sequelize.STRING,
      allowNull: true // or false, depending on your needs
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('steps', 'date', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
