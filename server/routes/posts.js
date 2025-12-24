const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    let userId = null;
    const token = req.headers['x-auth-token'];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user?.id || decoded.userId || null;
      } catch (err) {
        userId = null;
      }
    }

    const result = await pool.query(
      `SELECT p.post_id, p.user_id, u.username, p.title, p.description, 
              c.city_name as city, p.image_url, p.google_maps_link, p.price, 
              p.created_at, p.updated_at,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes_count,
              EXISTS(
                SELECT 1 FROM likes l 
                WHERE l.post_id = p.post_id AND l.user_id = $1
              ) as is_liked,
              EXISTS(
                SELECT 1 FROM follows f
                WHERE f.follower_id = $1 AND f.followed_id = p.user_id
              ) as is_following,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       JOIN cities c ON p.city_id = c.city_id
       ORDER BY p.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/posts/:city
// @desc    Get posts by city
router.get('/:city', async (req, res) => {
  try {
    let userId = null;
    const token = req.headers['x-auth-token'];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user?.id || decoded.userId || null;
      } catch (err) {
        userId = null;
      }
    }

    const result = await pool.query(
      `SELECT p.post_id, p.user_id, u.username, p.title, p.description, 
              c.city_name as city, p.image_url, p.google_maps_link, p.price, 
              p.created_at, p.updated_at,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes_count,
              EXISTS(
                SELECT 1 FROM likes l 
                WHERE l.post_id = p.post_id AND l.user_id = $2
              ) as is_liked,
              EXISTS(
                SELECT 1 FROM follows f
                WHERE f.follower_id = $2 AND f.followed_id = p.user_id
              ) as is_following,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       JOIN cities c ON p.city_id = c.city_id
       WHERE c.city_name = $1
       ORDER BY p.created_at DESC`,
      [req.params.city, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts
// @desc    Create new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      city,
      googleMapsLink,
      price
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: 'Image file is required' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const imageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

    const cityResult = await pool.query(
      'SELECT city_id FROM cities WHERE city_name = $1',
      [city]
    );

    if (cityResult.rows.length === 0) {
      return res.status(400).json({ msg: 'City not found' });
    }

    const cityId = cityResult.rows[0].city_id;

    const result = await pool.query(
      `INSERT INTO posts (user_id, city_id, title, description, image_url, google_maps_link, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING post_id, user_id, city_id, title, description, image_url, google_maps_link, price, created_at`,
      [req.user.id, cityId, title, description, imageUrl, googleMapsLink, price ? parseFloat(price) : 0]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if already liked
    const existingLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike - remove the like
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      const likesCountResult = await pool.query(
        'SELECT COUNT(*)::int as likes_count FROM likes WHERE post_id = $1',
        [postId]
      );
      res.json({ msg: 'Post unliked', liked: false, likes_count: likesCountResult.rows[0].likes_count });
    } else {
      // Like - add the like
      await pool.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      const likesCountResult = await pool.query(
        'SELECT COUNT(*)::int as likes_count FROM likes WHERE post_id = $1',
        [postId]
      );
      res.json({ msg: 'Post liked', liked: true, likes_count: likesCountResult.rows[0].likes_count });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/posts/:id/comments
// @desc    Get comments for a post
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.comment_id,
        c.comment_text,
        c.parent_comment_id,
        c.created_at,
        u.user_id,
        u.username,
        u.profile_picture_url
       FROM comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { comment_text, parent_comment_id } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, comment_text, parent_comment_id)
       VALUES ($1, $2, $3, $4)
       RETURNING comment_id, post_id, user_id, comment_text, parent_comment_id, created_at`,
      [postId, userId, comment_text, parent_comment_id || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (only author)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const postId = parseInt(req.params.id, 10);
    if (!postId || Number.isNaN(postId)) {
      return res.status(400).json({ msg: 'Invalid post id' });
    }

    const ownerCheck = await client.query(
      'SELECT user_id FROM posts WHERE post_id = $1',
      [postId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (ownerCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ msg: 'Not allowed to delete this post' });
    }

    await client.query('BEGIN');
    await client.query('DELETE FROM comments WHERE post_id = $1', [postId]);
    await client.query('DELETE FROM likes WHERE post_id = $1', [postId]);
    await client.query('DELETE FROM posts WHERE post_id = $1', [postId]);
    await client.query('COMMIT');

    res.json({ msg: 'Post deleted', post_id: postId });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {}
    console.error(err.message);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

module.exports = router;