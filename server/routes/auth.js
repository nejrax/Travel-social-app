
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
      const db = req.app.get('db'); 

      const { rows: existing } = await db.query(
        'SELECT user_id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existing.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const { rows } = await db.query(
        `INSERT INTO users (username, email, password_hash, profile_picture_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING user_id, username, email, created_at`,
        [
          username,
          email,
          hashedPassword,
          `https://i.pravatar.cc/150?u=${username}` 
        ]
      );

      const user = rows[0];

      // Generate JWT
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          profilePicture: `https://i.pravatar.cc/150?u=${user.username}`
        }
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);


router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const db = req.app.get('db');

      // Find user by email
      const { rows } = await db.query(
        'SELECT user_id, username, password_hash FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: email,
          profilePicture: `https://i.pravatar.cc/150?u=${user.username}`
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
