'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'notes',
      [
        {
          critical: 'Critical note for Order 100',
          general: 'General note for Order 100',
          art: 'Art note for Order 100',
          task_id: 1, // references tasks.id = 1
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          critical: 'Critical note for Order 101',
          general: 'General note for Order 101',
          art: 'Art note for Order 101',
          task_id: 2, // references tasks.id = 2
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notes', null, {});
  },
};
