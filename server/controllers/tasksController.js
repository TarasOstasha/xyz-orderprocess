// const { Task, User } = require('../db/models');

const { Task } = require('./../models');


const initialTasks = [
    {
      id: 1,
      title: 'Order 100',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-21',
      status: ['Paid', 'Order from Vendor Confirmed'],
      priority: 'High',
    },
    {
      id: 2,
      title: 'Order 101',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-22',
      status: ['In Progress'],
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Order 101',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 4,
      title: 'Order 102',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 5,
      title: 'Order 103',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-21',
      status: ['Paid', 'Order from Vendor Confirmed'],
      priority: 'High',
    },
    {
      id: 6,
      title: 'Order 104',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-22',
      status: ['In Progress'],
      priority: 'Medium',
    },
    {
      id: 7,
      title: 'Order 105',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 8,
      title: 'Order 106',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 9,
      title: 'Order 107',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-21',
      status: ['Paid', 'Order from Vendor Confirmed'],
      priority: 'High',
    },
    {
      id: 10,
      title: 'Order 108',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-22',
      status: ['In Progress'],
      priority: 'Medium',
    },
    {
      id: 11,
      title: 'Order 109',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 12,
      title: 'Order 110',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 13,
      title: 'Order 111',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-21',
      status: ['Paid', 'Order from Vendor Confirmed'],
      priority: 'High',
    },
    {
      id: 14,
      title: 'Order 112',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-22',
      status: ['In Progress'],
      priority: 'Medium',
    },
    {
      id: 15,
      title: 'Order 113',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
    {
      id: 16,
      title: 'Order 114',
      ship: 'Ship1 // AD',
      art: '2024-02-22',
      inHand: '2024-02-21',
      dueDate: '2024-02-23',
      status: ['Completed', 'On Hold'],
      priority: 'Low',
    },
  ];

module.exports.getTasks = async (req, res, next) => {
  try {
    // const foundTasks = await Task.findAll({
    //   raw: true,
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   include: {
    //     model: User,
    //     attributes: ['firstName', 'lastName'],
    //   },
    // });
    const foundTasks = await Task.findAll({
        raw: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      console.log(foundTasks, 'foundTasks');
    res.status(200).send({ tasks: initialTasks });
  } catch (err) {
    next(err);
  }
};