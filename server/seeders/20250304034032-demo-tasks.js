'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Order 100',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-01'),
        in_hand: new Date('2025-09-02'),
        due_date: new Date('2025-09-03'),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 101',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-04'),
        in_hand: new Date('2025-09-05'),
        due_date: new Date('2025-09-06'),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 101',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-07'),
        in_hand: new Date('2025-09-08'),
        due_date: new Date('2025-09-09'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 102',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-10'),
        in_hand: new Date('2025-09-11'),
        due_date: new Date('2025-09-12'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 103',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-13'),
        in_hand: new Date('2025-09-14'),
        due_date: new Date('2025-09-15'),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 104',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-16'),
        in_hand: new Date('2025-09-17'),
        due_date: new Date('2025-09-18'),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 105',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-19'),
        in_hand: new Date('2025-09-20'),
        due_date: new Date('2025-09-21'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 106',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-22'),
        in_hand: new Date('2025-09-23'),
        due_date: new Date('2025-09-24'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 107',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-25'),
        in_hand: new Date('2025-09-26'),
        due_date: new Date('2025-09-27'),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 108',
        ship: 'Ship1 // AD',
        art: new Date('2025-09-28'),
        in_hand: new Date('2025-09-29'),
        due_date: new Date('2025-09-30'),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 109',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-01'),
        in_hand: new Date('2025-10-02'),
        due_date: new Date('2025-10-03'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 110',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-04'),
        in_hand: new Date('2025-10-05'),
        due_date: new Date('2025-10-06'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 111',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-07'),
        in_hand: new Date('2025-10-08'),
        due_date: new Date('2025-10-09'),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 112',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-10'),
        in_hand: new Date('2025-10-11'),
        due_date: new Date('2025-10-12'),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 113',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-13'),
        in_hand: new Date('2025-10-14'),
        due_date: new Date('2025-10-15'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Order 114',
        ship: 'Ship1 // AD',
        art: new Date('2025-10-16'),
        in_hand: new Date('2025-10-17'),
        due_date: new Date('2025-10-18'),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
