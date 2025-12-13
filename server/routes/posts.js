const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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
    const result = await pool.query(
      `SELECT p.post_id, p.user_id, u.username, p.title, p.description, 
              c.city_name as city, p.image_url, p.google_maps_link, p.price, 
              p.created_at, p.updated_at
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       JOIN cities c ON p.city_id = c.city_id
       ORDER BY p.created_at DESC`
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
    const result = await pool.query(
      `SELECT p.post_id, p.user_id, u.username, p.title, p.description, 
              c.city_name as city, p.image_url, p.google_maps_link, p.price, 
              p.created_at, p.updated_at
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       JOIN cities c ON p.city_id = c.city_id
       WHERE c.city_name = $1
       ORDER BY p.created_at DESC`,
      [req.params.city]
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

    const imageUrl = `/uploads/${req.file.filename}`;

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

module.exports = router;