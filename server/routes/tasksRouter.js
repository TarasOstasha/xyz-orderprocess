const { Router } = require('express');
const { tasksController } = require('../controllers');
const { paginateTasks } = require('../middleware/paginate');
const { upload } = require('../middleware');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const tasksRouter = Router();

// /api/tasks
tasksRouter
    .route('/')
    .post(tasksController.createTask)
    .get(paginateTasks, tasksController.getTasks);

tasksRouter
    .route('/:id')
    .get(tasksController.getUpdatedTaskById)
    //.put(upload.any(),tasksController.updateTask)
    .put(upload.uploadTaskPhoto,tasksController.updateTaskById)
    .delete(tasksController.deleteTaskById);

module.exports = tasksRouter;