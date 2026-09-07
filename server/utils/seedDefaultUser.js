const bcrypt = require('bcrypt');
const { User } = require('../models');

const SALT_ROUNDS = 10;

/**
 * Creates DEFAULT_USER_* from env if that email is not already registered.
 * Set on the API host (not Vercel frontend): DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, optional DEFAULT_USER_NAME.
 */
async function seedDefaultUser() {
  const email = process.env.DEFAULT_USER_EMAIL;
  const password = process.env.DEFAULT_USER_PASSWORD;
  const name = process.env.DEFAULT_USER_NAME || 'Tony Joss';

  if (!email || !password) {
    return;
  }

  if (password.length < 6) {
    console.warn('DEFAULT_USER_PASSWORD must be at least 6 characters; skipping seed');
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await User.scope('withPassword').findOne({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.log(`Default user already exists: ${normalizedEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({
    name: String(name).trim() || 'Tony Joss',
    email: normalizedEmail,
    passwordHash,
  });

  console.log(`Seeded default user: ${normalizedEmail}`);
}

module.exports = { seedDefaultUser };
