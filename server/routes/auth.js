const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');

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

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, username, email, full_name, bio, location, website, profile_picture_url, created_at,
        (SELECT COUNT(*) FROM follows WHERE followed_id = users.user_id) as followers,
        (SELECT COUNT(*) FROM follows WHERE follower_id = users.user_id) as following
       FROM users WHERE user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.full_name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      profilePicture: user.profile_picture_url,
      joinedDate: user.created_at,
      followers: parseInt(user.followers) || 0,
      following: parseInt(user.following) || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, location, website, profilePicture } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, bio = $2, location = $3, website = $4, profile_picture_url = $5
       WHERE user_id = $6
       RETURNING user_id, username, email, full_name, bio, location, website, profile_picture_url, created_at`,
      [name, bio, location, website, profilePicture, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.full_name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      profilePicture: user.profile_picture_url,
      joinedDate: user.created_at
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user posts
router.get('/profile/posts', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.post_id,
        p.image_url,
        p.description,
        p.title,
        p.created_at,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
       FROM posts p
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    const posts = result.rows.map(post => ({
      id: post.post_id,
      image: post.image_url,
      caption: post.description,
      title: post.title,
      date: post.created_at,
      likes: parseInt(post.likes_count) || 0,
      comments: parseInt(post.comments_count) || 0
    }));

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
