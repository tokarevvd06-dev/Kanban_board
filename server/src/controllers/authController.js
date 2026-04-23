const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const asyncHandler = require('../middleware/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET; // потом перенесём в .env

// REGISTER
const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // проверка существующего пользователя
  const userExists = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // хеш пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // создание пользователя
  const newUser = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email, name`,
    [email, hashedPassword, name]
  );

  res.status(201).json({
    success: true,
    data: newUser.rows[0]
  });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userResult = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = userResult.rows[0];

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // создаём JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  });
});

module.exports = { register, login };