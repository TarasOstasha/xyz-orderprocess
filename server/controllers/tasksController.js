// const { Task, User } = require('../db/models');
const _ = require('lodash');
const createHttpError = require('http-errors');
const { Task } = require('./../models');


// const initialTasks = [
//     {
//       id: 1,
//       title: 'Order 100',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-21',
//       status: ['Paid', 'Order from Vendor Confirmed'],
//       priority: 'High',
//     },
//     {
//       id: 2,
//       title: 'Order 101',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-22',
//       status: ['In Progress'],
//       priority: 'Medium',
//     },
//     {
//       id: 3,
//       title: 'Order 101',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 4,
//       title: 'Order 102',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 5,
//       title: 'Order 103',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-21',
//       status: ['Paid', 'Order from Vendor Confirmed'],
//       priority: 'High',
//     },
//     {
//       id: 6,
//       title: 'Order 104',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-22',
//       status: ['In Progress'],
//       priority: 'Medium',
//     },
//     {
//       id: 7,
//       title: 'Order 105',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 8,
//       title: 'Order 106',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 9,
//       title: 'Order 107',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-21',
//       status: ['Paid', 'Order from Vendor Confirmed'],
//       priority: 'High',
//     },
//     {
//       id: 10,
//       title: 'Order 108',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-22',
//       status: ['In Progress'],
//       priority: 'Medium',
//     },
//     {
//       id: 11,
//       title: 'Order 109',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 12,
//       title: 'Order 110',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 13,
//       title: 'Order 111',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-21',
//       status: ['Paid', 'Order from Vendor Confirmed'],
//       priority: 'High',
//     },
//     {
//       id: 14,
//       title: 'Order 112',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-22',
//       status: ['In Progress'],
//       priority: 'Medium',
//     },
//     {
//       id: 15,
//       title: 'Order 113',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//     {
//       id: 16,
//       title: 'Order 114',
//       ship: 'Ship1 // AD',
//       art: '2024-02-22',
//       inHand: '2024-02-21',
//       dueDate: '2024-02-23',
//       status: ['Completed', 'On Hold'],
//       priority: 'Low',
//     },
//   ];

exports.createTask = async (req, res, next) => {
  const { body } = req;
  console.log(body, 'body')
  try {
    const createdTask = await Task.create(body);
    if (!createdTask) {
      return next(createError(400, 'Something went wrong'));
    }
    const preparedTask = _.omit(createdTask.get(), [
      'createdAt',
      'updatedAt',
    ]);
    return res.status(201).send(preparedTask);
  } catch (err) {
    next(err);
  }
}

exports.getTasks = async (req, res, next) => {
  try {
    const { limit, offset } = req.pagination;
    
    const { rows: foundTasks, count } = await Task.findAndCountAll({
      raw: true,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset,
      order: ['id']
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = offset / limit + 1;

    return res.status(200).send({
      tasks: foundTasks,
      totalPages,
      currentPage,
      totalItems: count
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id, 'id');
    const deletedRows = await Task.destroy({ where: { id } });

    if (deletedRows === 0) {
      return next(createHttpError(404, 'Task Not Found'));
    }

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}