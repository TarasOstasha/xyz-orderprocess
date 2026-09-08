'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const findTaskId = async (title, offset = 0) => {
      const rows = await queryInterface.sequelize.query(
        `SELECT id FROM tasks WHERE title = :title ORDER BY id ASC LIMIT 1 OFFSET :offset`,
        {
          replacements: { title, offset },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      if (!rows.length) {
        throw new Error(
          `Demo pasted-history seeder: task with title "${title}" (offset ${offset}) not found`
        );
      }
      return rows[0].id;
    };

    const order100Id = await findTaskId('Order 100');
    const order101Id = await findTaskId('Order 101', 0);
    const now = new Date();

    await queryInterface.bulkInsert('pasted_histories', [
      {
        text: 'Some pasted text for Task #1',
        images: ['data:image/png;base64,...'],
        task_id: order100Id,
        created_at: now,
        updated_at: now,
      },
      {
        text: 'Another paste entry for Task #1',
        images: ['data:image/png;base64,...', 'data:image/png;base64,...'],
        task_id: order100Id,
        created_at: now,
        updated_at: now,
      },
      {
        text: 'A paste for Task #2',
        images: ['data:image/png;base64,...', 'data:image/png;base64,...'],
        task_id: order101Id,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pasted_histories', null, {});
  },
};
