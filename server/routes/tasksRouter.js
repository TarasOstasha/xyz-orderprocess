const { Router } = require('express');
const { tasksController } = require('../controllers');
const { paginateTasks } = require('../middleware/paginate');

const tasksRouter = Router();

// /api/tasks
tasksRouter
    .route('/')
    .post(tasksController.createTask)
    .get(paginateTasks, tasksController.getTasks);

tasksRouter
    .route('/:id')
    // .get(tasksController.getTask)
    // .put(tasksController.updateTask)
    .delete(tasksController.deleteTaskById);

module.exports = tasksRouter;