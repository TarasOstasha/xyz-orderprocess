const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  if (!JWT_SECRET) {
    throw createHttpError(500, 'JWT_SECRET is not configured');
  }
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/** Require valid Bearer JWT; attach req.user = { id, name, email } */
async function authenticate(req, res, next) {
  try {
    if (!JWT_SECRET) {
      return next(createHttpError(500, 'JWT_SECRET is not configured'));
    }

    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Authentication required'));
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signToken,
  authenticate,
};
