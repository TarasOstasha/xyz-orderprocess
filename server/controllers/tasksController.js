// const { Task, User } = require('../db/models');
const _ = require('lodash');
const { getUpdatedTask, rebuildPastedHistory, removeTimestamps } = require('../utils');

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

module.exports.createTask = async (req, res, next) => {
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

// module.exports.getTasks = async (req, res, next) => {
//   try {
//     const { limit, offset } = req.pagination;

//     const { rows: foundTasks, count } = await Task.findAndCountAll({
//       raw: true,
//       attributes: { exclude: ['createdAt', 'updatedAt'] },
//       limit,
//       offset,
//       order: ['id'],
//     });

//     const totalPages = Math.ceil(count / limit);
//     const currentPage = offset / limit + 1;
//     console.log(foundTasks, 'foundTasks')
//     return res.status(200).send({
//       tasks: foundTasks,
//       totalPages,
//       currentPage,
//       totalItems: count,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Task.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [Note, Step, PastedHistory],
    });

    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({
      tasks: rows,
      totalPages,
      currentPage: page,
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
  console.log('updateTaskById works!');
  try {
    const taskId = req.params.id;

    // ─────────────────────────────────────────────────────────
    // 1) Parse any JSON fields that the frontend might send
    //    (like status, notes, steps, or pastedHistory)
    // ─────────────────────────────────────────────────────────
    if (typeof req.body.status === 'string') {
      try {
        req.body.status = JSON.parse(req.body.status);
      } catch (err) {
        req.body.status = undefined; // If invalid JSON, or you can do []
      }
    }
    if (typeof req.body.notes === 'string') {
      try {
        req.body.notes = JSON.parse(req.body.notes);
      } catch (err) {
        req.body.notes = undefined;
      }
    }
    if (typeof req.body.steps === 'string') {
      try {
        req.body.steps = JSON.parse(req.body.steps);
      } catch (err) {
        req.body.steps = undefined;
      }
    }
    if (typeof req.body.pastedHistory === 'string') {
      try {
        req.body.pastedHistory = JSON.parse(req.body.pastedHistory);
      } catch (err) {
        req.body.pastedHistory = undefined;
      }
    }

    // If using bracketed fields + multer for images, rebuild them:
    const bracketedPH = rebuildPastedHistory(req);
    if (bracketedPH.length > 0) {
      // Attach these new items to req.body if needed
      req.body.pastedHistory = bracketedPH;
    }

    // ─────────────────────────────────────────────────────────
    // 2) PARTIAL UPDATE: Only update Task columns that are present
    //    in req.body (so any missing field => keep old data)
    // ─────────────────────────────────────────────────────────
    const updatableFields = ['title', 'ship', 'art', 'inHand', 'dueDate', 'status', 'priority'];
    const taskFields = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        taskFields[field] = req.body[field];
      }
    }

    // Example: If the user did NOT send "title", we do NOT overwrite it with an empty
    // If they DID send "title: 'New Title'", we only update that column.

    // We do a single .update for the Task’s main columns
    const [count, [updatedTask]] = await Task.update(taskFields, {
      where: { id: taskId },
      returning: true,
    });
    if (!count) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ─────────────────────────────────────────────────────────
    // 3) PARTIAL UPDATE for the Task's Note (if provided)
    // ─────────────────────────────────────────────────────────
    if (req.body.notes !== undefined) {
      // If notes is not in req.body, we skip => old notes remain
      const existingNote = await Note.findOne({ where: { taskId } });
      console.log(existingNote, 'existingNote');
      if (!existingNote) {
        // If none found, create
        await Note.create({
          ...req.body.notes,
          taskId,
        });
      } else {
        // Merge old data if you want partial merges:
        // e.g. existingNote.critical = req.body.notes.critical ?? existingNote.critical
        // Or just do a .set, which overwrites any provided fields:
        existingNote.set(req.body.notes);
        await existingNote.save();
      }
    }

    // ─────────────────────────────────────────────────────────
    // 4) PARTIAL UPDATE for Steps
    //    If steps is missing => do NOTHING (keep old steps).
    //    If steps is an array => we can replace them or partially update.
    // ─────────────────────────────────────────────────────────
    if (Array.isArray(req.body.steps)) {
      // In this example, let's DELETE all old rows & re-insert:
      await Step.destroy({ where: { taskId } });
      for (const stepData of req.body.steps) {
        // Omit stepData.id if you want auto-increment
        await Step.create({ ...stepData, taskId });
      }
    }

    // ─────────────────────────────────────────────────────────
    // 5) PARTIAL "Upsert" for PastedHistory
    //    If not provided => skip entirely
    // ─────────────────────────────────────────────────────────
    if (Array.isArray(req.body.pastedHistory)) {
      // Load existing
      const existingPH = await PastedHistory.findAll({ where: { taskId } });
      // Put in a Map keyed by ID
      const existingMap = new Map(existingPH.map((ph) => [ph.id, ph]));

      for (const newItem of req.body.pastedHistory) {
        newItem.taskId = taskId; // ensure correct foreign key

        if (newItem.id) {
          // Possibly an update
          const existingRow = existingMap.get(newItem.id);
          if (existingRow) {
            // MERGE old data for any fields not sent
            const mergedData = {
              text: newItem.text !== undefined ? newItem.text : existingRow.text,
              images: newItem.images !== undefined ? newItem.images : existingRow.images,
              // add more columns as needed
            };
            existingRow.set(mergedData);
            await existingRow.save();
            existingMap.delete(newItem.id);
          } else {
            // If front-end gave an ID but doesn't exist in DB => create new
            await PastedHistory.create({ ...newItem, id: undefined });
          }
        } else {
          // brand new row
          await PastedHistory.create(newItem);
        }
      }

      // If you want leftover old rows removed, do so here:
      // for (const leftoverId of existingMap.keys()) {
      //   await existingMap.get(leftoverId).destroy();
      // }
    }

    // ─────────────────────────────────────────────────────────
    // 6) Re-fetch the updated Task with associations
    // ─────────────────────────────────────────────────────────
    const finalTask = await Task.findByPk(taskId, {
      include: [Note, Step, PastedHistory],
    });
    if (!finalTask) {
      return res.status(404).json({ message: 'Task not found after update' });
    }

    // ─────────────────────────────────────────────────────────
    // 7) Return fresh data to the front end
    // ─────────────────────────────────────────────────────────
    return res.status(200).json({ data: finalTask.toJSON() });
  } catch (err) {
    console.error('Update task error:', err);
    return next(err); // or res.status(500).json({ error: err.message });
  }
};

module.exports.getUpdatedTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
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
