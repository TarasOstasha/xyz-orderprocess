'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'steps',
      [
        {
          step: 'PAYMENT PROCESSED',
          date: new Date('2025-09-01'),
          by: 'Alice',
          notes: 'Payment received from client',
          task_id: 1, // references tasks.id
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          step: 'Order Placed',
          date: new Date('2025-09-02'),
          by: 'Bob',
          notes: 'Placed order with vendor',
          task_id: 1, // references tasks.id
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          step: 'Vendor Confirmation Checked',
          date: new Date('2025-09-03'),
          by: 'Charlie',
          notes: 'Checked vendor confirmation details',
          task_id: 1, // references tasks.id
          created_at: new Date(),
          updated_at: new Date(),
        },

        // For "Order 101" (ID=2)
        {
          step: 'PAYMENT PROCESSED',
          date: new Date('2025-10-01'),
          by: 'Diana',
          notes: 'Client paid invoice',
          task_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          step: 'Order Placed',
          date: new Date('2025-10-02'),
          by: 'Ethan',
          notes: 'Placed order with vendor #2',
          task_id: 14,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('steps', null, {});
  },
};
