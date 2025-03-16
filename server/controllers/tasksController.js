
const _ = require('lodash');
const { removeTimestamps } = require('../utils/removeTimestamps');
//const { getUpdatedTask, rebuildPastedHistory } = require('../utils/helpers');
const { getUpdatedTask, rebuildPastedHistory, removeTimestamps } = require('../utils');
const createHttpError = require('http-errors');

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

module.exports.updateTaskById = async (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  try {
    const taskId = req.params.id;

    // 1) Parse JSON fields if needed (status, notes, steps, etc.)
    if (typeof req.body.status === 'string') {
      try {
        req.body.status = JSON.parse(req.body.status);
      } catch (err) {
        console.error('Invalid JSON for status:', err);
        req.body.status = []; // or leave undefined
      }
    }
    if (typeof req.body.notes === 'string') {
      try {
        req.body.notes = JSON.parse(req.body.notes);
      } catch (err) {
        console.error('Invalid JSON for notes:', err);
        req.body.notes = undefined;
      }
    }
    if (typeof req.body.steps === 'string') {
      try {
        req.body.steps = JSON.parse(req.body.steps);
      } catch (err) {
        console.error('Invalid JSON for steps:', err);
        req.body.steps = undefined;
      }
    }
    if (typeof req.body.pastedHistory === 'string') {
      try {
        req.body.pastedHistory = JSON.parse(req.body.pastedHistory);
      } catch (err) {
        console.error('Invalid JSON for pastedHistory:', err);
        req.body.pastedHistory = undefined;
      }
    }

    // 2) PARTIAL update the main Task columns
    //    We only set fields that exist in req.body (so if a field is missing, old data stays).
    const updatableFields = ['title', 'ship', 'art', 'inHand', 'dueDate', 'status', 'priority'];
    const taskFields = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        taskFields[field] = req.body[field];
      }
    }

    // 3) Update the Task in one go (excluding notes/steps/pastedHistory)
    const [count, [updatedTask]] = await Task.update(taskFields, {
      where: { id: taskId },
      returning: true,
    });
    if (!count) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 4) Handle Notes only if provided
    if (req.body.notes !== undefined) {
      const existingNote = await Note.findOne({ where: { taskId } });
      if (!existingNote) {
        // create
        await Note.create({
          ...req.body.notes,
          taskId,
        });
      } else {
        // update existing
        existingNote.set(req.body.notes);
        await existingNote.save();
      }
    }

    // 5) Handle Steps only if provided
    //    If steps is missing => old steps remain
    if (Array.isArray(req.body.steps)) {
      // remove old steps
      await Step.destroy({ where: { taskId } });
      // create new steps
      for (const stepData of req.body.steps) {
        await Step.create({ ...stepData, taskId });
      }
    }

    // 6) Handle PastedHistory only if provided
    // If your front end sends bracketed fields for pastedHistory, rebuild them:
    const bracketedPH =  rebuildPastedHistory(req);
    if (bracketedPH.length > 0) {
      // Attach to req.body so your existing upsert logic sees it
      req.body.pastedHistory = bracketedPH;
    }
    console.log(req.body.pastedHistory, 'req.body.pastedHistory');

    // ... any other parsing for status, notes, steps, etc. ...
    // e.g. parse JSON if they're strings

    // Then your partial-merge upsert logic:
    if (Array.isArray(req.body.pastedHistory)) {
      const existingPH = await PastedHistory.findAll({ where: { taskId } });
      const existingMap = new Map(existingPH.map((ph) => [ph.id, ph]));

      for (const newItem of req.body.pastedHistory) {
        console.log('Incoming newItem =>', newItem);

        newItem.taskId = taskId; // ensure correct FK

        if (newItem.id) {
          const existingRow = existingMap.get(newItem.id);
          if (existingRow) {
            // PARTIAL MERGE to keep old data for missing fields
            const mergedData = {
              text: newItem.text !== undefined ? newItem.text : existingRow.text,
              images: newItem.images !== undefined ? newItem.images : existingRow.images,
              // ... any other columns you want to preserve
            };
            console.log('Merged data for existing row =>', mergedData);

            existingRow.set(mergedData);
            await existingRow.save();
            console.log('Updated row =>', existingRow.toJSON());

            existingMap.delete(newItem.id);
          } else {
            // If an ID was given but no matching row, create new
            console.log('Creating new row with =>', newItem);
            await PastedHistory.create({ ...newItem, id: undefined });
          }
        } else {
          // brand new row
          console.log('Creating brand new row =>', newItem);
          await PastedHistory.create(newItem);
        }
      }

      // If you want to remove leftover old rows not in the new array, uncomment:
      // for (const leftoverId of existingMap.keys()) {
      //   await existingMap.get(leftoverId).destroy();
      // }
    }

    // 7) Refetch the fully updated Task with associations
    const finalTask = await Task.findByPk(taskId, {
      include: [Note, Step, PastedHistory],
    });

    if (!finalTask) {
      return res.status(404).json({ message: 'Task not found after update' });
    }

    // 8) Return
    return res.status(200).json({ data: finalTask.toJSON() });
  } catch (err) {
    console.error('Update task error:', err);
    return next(err); // or res.status(500).json({ error: err.message });
  }
};

module.exports.getUpdatedTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    //console.log(taskId, '<< taskId')
    // 1) Find and update your Task, Note, Steps, PastedHistory as needed
    //    (Same logic as before: parse status, task.set(...), update or create notes, etc.)
    //    ...

    // 2) After all updates, get the fresh data
    const updatedTask = await getUpdatedTask(taskId);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found after update' });
    }

    const plainData = updatedTask.toJSON(); // Convert Sequelize model -> plain object
    const sanitizedData = removeTimestamps(plainData);
    //console.log(sanitizedData, 'sanitizedData')
    // 3) Return it
    return res.status(200).send({ sanitizedData });
  } catch (err) {
    console.error('Update task error:', err);
    return next(err);
  }
};
