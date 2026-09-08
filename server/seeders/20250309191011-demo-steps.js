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
        throw new Error(`Demo steps seeder: task with title "${title}" (offset ${offset}) not found`);
      }
      return rows[0].id;
    };

    // Resolve IDs by title (Neon may not start task IDs at 1)
    const order100Id = await findTaskId('Order 100');
    const order101Id = await findTaskId('Order 101', 0); // first "Order 101"
    const order112Id = await findTaskId('Order 112'); // was hard-coded task_id 14

    const now = new Date();

    await queryInterface.bulkInsert(
      'steps',
      [
        {
          step: 'PAYMENT PROCESSED',
          date: new Date('2025-09-01'),
          by: 'Alice',
          notes: 'Payment received from client',
          task_id: order100Id,
          created_at: now,
          updated_at: now,
        },
        {
          step: 'Order Placed',
          date: new Date('2025-09-02'),
          by: 'Bob',
          notes: 'Placed order with vendor',
          task_id: order100Id,
          created_at: now,
          updated_at: now,
        },
        {
          step: 'Vendor Confirmation Checked',
          date: new Date('2025-09-03'),
          by: 'Charlie',
          notes: 'Checked vendor confirmation details',
          task_id: order100Id,
          created_at: now,
          updated_at: now,
        },

        // For "Order 101"
        {
          step: 'PAYMENT PROCESSED',
          date: new Date('2025-10-01'),
          by: 'Diana',
          notes: 'Client paid invoice',
          task_id: order101Id,
          created_at: now,
          updated_at: now,
        },
        {
          step: 'Order Placed',
          date: new Date('2025-10-02'),
          by: 'Ethan',
          notes: 'Placed order with vendor #2',
          task_id: order112Id,
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('steps', null, {});
  },
};
