'use strict';

function daysFromNow(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Order 100',
        ship: 'Ship1 // AD',
        art: daysFromNow(1),
        in_hand: daysFromNow(2),
        due_date: daysFromNow(3),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 101',
        ship: 'Ship1 // AD',
        art: daysFromNow(3),
        in_hand: daysFromNow(4),
        due_date: daysFromNow(5),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 101',
        ship: 'Ship1 // AD',
        art: daysFromNow(5),
        in_hand: daysFromNow(6),
        due_date: daysFromNow(7),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 102',
        ship: 'Ship1 // AD',
        art: daysFromNow(7),
        in_hand: daysFromNow(8),
        due_date: daysFromNow(9),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 103',
        ship: 'Ship1 // AD',
        art: daysFromNow(9),
        in_hand: daysFromNow(10),
        due_date: daysFromNow(11),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 104',
        ship: 'Ship1 // AD',
        art: daysFromNow(11),
        in_hand: daysFromNow(12),
        due_date: daysFromNow(13),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 105',
        ship: 'Ship1 // AD',
        art: daysFromNow(13),
        in_hand: daysFromNow(14),
        due_date: daysFromNow(15),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 106',
        ship: 'Ship1 // AD',
        art: daysFromNow(15),
        in_hand: daysFromNow(16),
        due_date: daysFromNow(17),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 107',
        ship: 'Ship1 // AD',
        art: daysFromNow(17),
        in_hand: daysFromNow(18),
        due_date: daysFromNow(19),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 108',
        ship: 'Ship1 // AD',
        art: daysFromNow(19),
        in_hand: daysFromNow(20),
        due_date: daysFromNow(21),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 109',
        ship: 'Ship1 // AD',
        art: daysFromNow(21),
        in_hand: daysFromNow(22),
        due_date: daysFromNow(23),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 110',
        ship: 'Ship1 // AD',
        art: daysFromNow(23),
        in_hand: daysFromNow(24),
        due_date: daysFromNow(25),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 111',
        ship: 'Ship1 // AD',
        art: daysFromNow(25),
        in_hand: daysFromNow(26),
        due_date: daysFromNow(27),
        status: ['Paid', 'Order from Vendor Confirmed'],
        priority: 'High',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 112',
        ship: 'Ship1 // AD',
        art: daysFromNow(27),
        in_hand: daysFromNow(28),
        due_date: daysFromNow(29),
        status: ['In Progress'],
        priority: 'Medium',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 113',
        ship: 'Ship1 // AD',
        art: daysFromNow(29),
        in_hand: daysFromNow(30),
        due_date: daysFromNow(31),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      },
      {
        title: 'Order 114',
        ship: 'Ship1 // AD',
        art: daysFromNow(31),
        in_hand: daysFromNow(32),
        due_date: daysFromNow(33),
        status: ['Completed', 'On Hold'],
        priority: 'Low',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
