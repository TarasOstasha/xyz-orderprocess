'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ship: {
        type: Sequelize.STRING,
        allowNull: false
      },
      art: {
        type: Sequelize.DATE,
        allowNull: false
      },
      in_hand: {
        type: Sequelize.DATE
      },
      due_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      priority: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('tasks', {
      fields: ['due_date'],
      type: 'check',
      name: 'check_due_date_not_in_past',
      where: {
        due_date: {
          [Sequelize.Op.gte]: Sequelize.literal('CURRENT_DATE'),
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
    await queryInterface.removeConstraint('tasks', 'check_due_date_not_in_past');
  }
};