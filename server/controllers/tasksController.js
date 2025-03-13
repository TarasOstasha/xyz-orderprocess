// const { Task, User } = require('../db/models');
const _ = require('lodash');
const { removeTimestamps } = require('../utils/removeTimestamps');
const createHttpError = require('http-errors');
// const { Task, Notes, Steps, PastedHistory, sequelize  } = require('./../models');
const { Task, Note, Step, PastedHistory } = require('../models');

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
  console.log(body, 'body');
  try {
    const createdTask = await Task.create(body);
    if (!createdTask) {
      return next(createError(400, 'Something went wrong'));
    }
    const preparedTask = _.omit(createdTask.get(), ['createdAt', 'updatedAt']);
    return res.status(201).send(preparedTask);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { limit, offset } = req.pagination;

    const { rows: foundTasks, count } = await Task.findAndCountAll({
      raw: true,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset,
      order: ['id'],
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = offset / limit + 1;

    return res.status(200).send({
      tasks: foundTasks,
      totalPages,
      currentPage,
      totalItems: count,
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
};

// module.exports.updateTaskById = async (req, res, next) => {
//   const { id } = req.params;
//   const { body } = req;
//   const { files } = req;
//   console.log(files, 'files')
//   console.log(body, 'body')
//   console.log(id, 'id')
//   try {

//   } catch (error) {
//     next(error);
//   }
// };

module.exports.updateTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId, {
      include: [Note, Step, PastedHistory],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // // 2) Update the main Task fields with "task.set()"
    if (typeof req.body.status === 'string') {
      try {
        req.body.status = JSON.parse(req.body.status);
      } catch (error) {
        // If parsing fails, you might handle it or default to an empty array
        console.error('Invalid JSON for status', error);
        req.body.status = [];
      }
    }
    task.set(req.body);
    await task.save();
    //console.log('req.body.notes:', req.body.notes);

    if (req.body.notes) {
      if (!task.Note) {
        // create one
        await Note.create({
          ...req.body.notes,
          taskId: task.id,
        });
      } else {
        try {
          task.Note.set(req.body.notes);
          await task.Note.save();
        } catch (err) {
          console.error('Error updating note:', err);
        }
      }
    }

    if (Array.isArray(req.body.steps)) {
      // 1) Delete all existing steps for this task
      await Step.destroy({ where: { taskId: task.id } });
    
      // 2) Insert new steps
      for (const stepData of req.body.steps) {
        // Let the DB auto-increment "id" (omit stepData.id)
        await Step.create({
          ...stepData,
          id: undefined,   // or just omit "id" entirely
          taskId: task.id
        });
      }
    }
    
    if (Array.isArray(req.body.pastedHistory)) {
      // 1) Fetch all existing PastedHistory rows for this task
      const existingPH = await PastedHistory.findAll({
        where: { taskId: task.id }
      });
    
      // Convert them into a Map keyed by `id` for quick lookup
      const existingMap = new Map(
        existingPH.map((ph) => [ph.id, ph])
      );
    
      // 2) Loop through the new array from the request
      for (const newItem of req.body.pastedHistory) {
        if (newItem.id) {
          // This suggests an existing row we might update
          const existingRow = existingMap.get(newItem.id);
    
          if (existingRow) {
            // We found a matching row in DB => update it
            existingRow.set(newItem); 
            // or do something like existingRow.text = newItem.text; ...
            await existingRow.save();
    
            // Remove from the map so we know we've "handled" it
            existingMap.delete(newItem.id);
          } else {
            // There's an `id` but no matching row in DB => create new
            // Omit the `id` if you're letting the DB auto-increment, 
            // or if your front end provides a valid ID that doesn't conflict, keep it.
            await PastedHistory.create({
              ...newItem,
              id: undefined,   // let DB assign a new primary key
              taskId: task.id
            });
          }
        } else {
          // No `id` => definitely a new record
          await PastedHistory.create({
            ...newItem,
            taskId: task.id
          });
        }
      }
    }

    const updatedTask = await Task.findByPk(taskId, {
      include: [Note, Step, PastedHistory],
    });

    // // 6) Send a response
    return res.status(200).json({ data: updatedTask.toJSON() });
  } catch (err) {
    console.error('Update task error:', err);
    return next(err); // or res.status(500).json({ error: err.message });
  }
};

async function getUpdatedTask(taskId) {
  const updatedTask = await Task.findByPk(taskId, {
    include: [Note, Step, PastedHistory],
  });
  return updatedTask; 
}

module.exports.getUpdatedTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    
    // 1) Find and update your Task, Note, Steps, PastedHistory as needed
    //    (Same logic as before: parse status, task.set(...), update or create notes, etc.)
    //    ...
    
    // 2) After all updates, get the fresh data
    const updatedTask = await getUpdatedTask(taskId);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found after update' });
    }

    const plainData = updatedTask.toJSON();          // Convert Sequelize model -> plain object
    const sanitizedData = removeTimestamps(plainData);
    
    // 3) Return it
    return res.status(200).json({ data: sanitizedData });
  } catch (err) {
    console.error('Update task error:', err);
    return next(err); 
  }
};