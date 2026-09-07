const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { User } = require('../models');
const { signToken } = require('../middleware/auth');

const SALT_ROUNDS = 10;

function validateSignup({ name, email, password }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required';
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Email must be valid';
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
}

function validateLogin({ email, password }) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email is required';
  }
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }
  return null;
}

module.exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const validationError = validateSignup({ name, email, password });
    if (validationError) {
      return next(createHttpError(400, validationError));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.scope('withPassword').findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return next(createHttpError(409, 'Email is already registered'));
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const validationError = validateLogin({ email, password });
    if (validationError) {
      return next(createHttpError(400, validationError));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.scope('withPassword').findOne({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }
    return res.status(200).json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};
