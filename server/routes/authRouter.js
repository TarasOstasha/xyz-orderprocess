const { Router } = require('express');
const { authController } = require('../controllers');
const { authenticate } = require('../middleware/auth');

const authRouter = Router();

// /api/auth
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/me', authenticate, authController.me);

module.exports = authRouter;
