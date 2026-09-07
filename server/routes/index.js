const { Router } = require('express');
const authRouter = require('./authRouter');
const tasksRouter = require('./tasksRouter');

const router = Router();

router.use('/auth', authRouter);
router.use('/tasks', tasksRouter);

module.exports = router;
