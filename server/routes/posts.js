const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
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
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/posts/:city
// @desc    Get posts by city
router.get('/:city', async (req, res) => {
  try {
    const posts = await Post.find({ city: req.params.city });
    res.json(posts);
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
      place,
      googleMapsLink,
      price
    } = req.body;

    const imageUrl = `/uploads/${req.file.filename}`;

    const post = new Post({
      userId: req.user.id,
      username: req.user.username,
      title,
      description,
      city,
      place,
      imageUrl,
      googleMapsLink,
      price: price ? parseFloat(price) : 0
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;