const { Router } = require('express');
const { tasksController } = require('../controllers');
const { paginateTasks } = require('../middleware/paginate');

const tasksRouter = Router();

// /api/tasks
tasksRouter
    .route('/')
    .get(paginateTasks, tasksController.getTasks);

module.exports = tasksRouter;