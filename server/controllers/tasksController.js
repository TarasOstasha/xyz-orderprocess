// const { Task, User } = require('../db/models');
const _ = require('lodash');
const {  getUpdatedTask, rebuildPastedHistory, removeTimestamps } = require('../utils');

const createHttpError = require('http-errors');
// const { Task, Notes, Steps, PastedHistory, sequelize  } = require('./../models');
const { Task, Note, Step, PastedHistory } = require('../models');
const presenceStore = require('../utils/presenceStore');

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
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').toString().trim();
    const { Op, QueryTypes } = require('sequelize');
    const { sequelize } = require('../models');

    // Search across task + notes/steps/pasted text, then paginate by task id
    // (avoid subQuery:false + JOINs, which breaks LIMIT and shows ~1 task)
    if (search) {
      const pattern = `%${search}%`;
      const idRows = await sequelize.query(
        `
        SELECT DISTINCT t.id
        FROM tasks t
        LEFT JOIN notes n ON n.task_id = t.id
        LEFT JOIN steps s ON s.task_id = t.id
        LEFT JOIN pasted_histories p ON p.task_id = t.id
        WHERE t.title ILIKE :pattern
           OR t.ship ILIKE :pattern
           OR t.priority ILIKE :pattern
           OR n.critical ILIKE :pattern
           OR n.general ILIKE :pattern
           OR n.art ILIKE :pattern
           OR s.step ILIKE :pattern
           OR s.notes ILIKE :pattern
           OR s.by ILIKE :pattern
           OR p.text ILIKE :pattern
        ORDER BY t.id ASC
        `,
        {
          replacements: { pattern },
          type: QueryTypes.SELECT,
        }
      );

      const allIds = idRows.map((row) => row.id);
      const totalPages = Math.ceil(allIds.length / limit) || 1;
      const pageIds = allIds.slice(offset, offset + limit);

      const tasks =
        pageIds.length === 0
          ? []
          : await Task.findAll({
              where: { id: { [Op.in]: pageIds } },
              include: [Note, Step, PastedHistory],
              order: [['id', 'ASC']],
            });

      return res.status(200).json({
        tasks,
        totalPages,
        currentPage: page,
      });
    }

    const { rows, count } = await Task.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [Note, Step, PastedHistory],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit) || 1;

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
  console.log('updateTaskById works!')
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
    const updatableFields = ['title','ship','art','inHand','dueDate','status','priority'];
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
    const saverName = req.user?.name;
    if (req.body.notes !== undefined) {
      // If notes is not in req.body, we skip => old notes remain
      const notesPayload = {
        ...req.body.notes,
        ...(saverName ? { lastSavedBy: saverName } : {}),
      };
      const existingNote = await Note.findOne({ where: { taskId } });
      console.log(existingNote, 'existingNote')
      if (!existingNote) {
        // If none found, create
        await Note.create({
          ...notesPayload,
          taskId,
        });
      } else {
        // Merge old data if you want partial merges:
        // e.g. existingNote.critical = req.body.notes.critical ?? existingNote.critical
        // Or just do a .set, which overwrites any provided fields:
        existingNote.set(notesPayload);
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
        await Step.create({
          ...stepData,
          taskId,
          ...(saverName ? { lastSavedBy: saverName } : {}),
        });
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
      const existingMap = new Map(existingPH.map(ph => [ph.id, ph]));

      for (const newItem of req.body.pastedHistory) {
        newItem.taskId = taskId; // ensure correct foreign key

        if (newItem.id) {
          // Possibly an update
          const existingRow = existingMap.get(newItem.id);
          if (existingRow) {
            // MERGE old data for any fields not sent
            const mergedData = {
              text:   newItem.text   !== undefined ? newItem.text   : existingRow.text,
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

/** Save one pasted entry (screenshot / order HTML) to DB immediately */
module.exports.addPastedHistory = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    if (!task) {
      return next(createHttpError(404, 'Task Not Found'));
    }

    const text = req.body.text || '';
    let images = '';

    if (Array.isArray(req.files) && req.files.length > 0) {
      const paths = req.files.map((file) =>
        file.path.replace(/\\/g, '/').replace(/^public\//, '')
      );
      images = paths.length === 1 ? paths[0] : JSON.stringify(paths);
    }

    const created = await PastedHistory.create({
      taskId,
      text,
      images,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('addPastedHistory error:', err);
    return next(err);
  }
};

module.exports.updatePastedHistory = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const pasteId = parseInt(req.params.pasteId, 10);

    const row = await PastedHistory.findOne({ where: { id: pasteId, taskId } });
    if (!row) {
      return next(createHttpError(404, 'Pasted entry not found'));
    }

    if (req.body.text !== undefined) {
      row.text = req.body.text;
    }

    if (Array.isArray(req.files) && req.files.length > 0) {
      const paths = req.files.map((file) =>
        file.path.replace(/\\/g, '/').replace(/^public\//, '')
      );
      row.images = paths.length === 1 ? paths[0] : JSON.stringify(paths);
    }

    await row.save();
    return res.status(200).json(row);
  } catch (err) {
    console.error('updatePastedHistory error:', err);
    return next(err);
  }
};

module.exports.deletePastedHistory = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const pasteId = parseInt(req.params.pasteId, 10);

    const deleted = await PastedHistory.destroy({ where: { id: pasteId, taskId } });
    if (!deleted) {
      return next(createHttpError(404, 'Pasted entry not found'));
    }

    return res.status(204).end();
  } catch (err) {
    console.error('deletePastedHistory error:', err);
    return next(err);
  }
};

/** Who is currently working on this task */
module.exports.getTaskPresence = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    return res.status(200).json({ users: presenceStore.list(taskId) });
  } catch (err) {
    return next(err);
  }
};

/** Join / heartbeat while viewing a task — identity from JWT */
module.exports.upsertTaskPresence = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const users = presenceStore.upsert(taskId, {
      userId: String(req.user.id),
      name: req.user.name,
      email: req.user.email,
    });
    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

/** Leave a task — identity from JWT */
module.exports.leaveTaskPresence = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const users = presenceStore.leave(taskId, String(req.user.id));
    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

