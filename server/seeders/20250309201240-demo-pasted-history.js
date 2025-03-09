'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pasted_histories', [
      {
        text: 'Some pasted text for Task #1',
        images: ['data:image/png;base64,...'],
        task_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        text: 'Another paste entry for Task #1',
        images: ['data:image/png;base64,...', 'data:image/png;base64,...'],
        task_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        text: 'A paste for Task #2',
        images: ['data:image/png;base64,...', 'data:image/png;base64,...'],
        task_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pasted_histories', null, {});
  },
};
