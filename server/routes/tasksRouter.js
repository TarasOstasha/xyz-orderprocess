const { Router } = require('express');
const { tasksController } = require('../controllers');
const { paginateTasks } = require('../middleware/paginate');
const { upload, auth } = require('../middleware');

const tasksRouter = Router();

tasksRouter.use(auth.authenticate);

// /api/tasks
tasksRouter
    .route('/')
    .post(tasksController.createTask)
    .get(paginateTasks, tasksController.getTasks);

// More specific routes MUST come before /:id
tasksRouter
    .route('/:id/pasted-history')
    .post(upload.uploadTaskPhoto, tasksController.addPastedHistory);

tasksRouter
    .route('/:id/pasted-history/:pasteId')
    .put(upload.uploadTaskPhoto, tasksController.updatePastedHistory)
    .delete(tasksController.deletePastedHistory);

tasksRouter
    .route('/:id/presence')
    .get(tasksController.getTaskPresence)
    .post(tasksController.upsertTaskPresence)
    .delete(tasksController.leaveTaskPresence);

tasksRouter
    .route('/:id')
    .get(tasksController.getUpdatedTaskById)
    .put(upload.uploadTaskPhoto, tasksController.updateTaskById)
    .delete(tasksController.deleteTaskById);

module.exports = tasksRouter;
