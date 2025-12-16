const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const generateUsername = (email) => {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
};


router.post('/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'i').withMessage('Password must contain letters and numbers'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const username = generateUsername(email);

    try {
      const userCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userCheck.rows.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
        [username, email, passwordHash]
      );

      const user = result.rows[0];

      const payload = {
        user: {
          id: user.user_id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.user_id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
