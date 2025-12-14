// server/routes/posts.js
const express = require('express');
const router = express.Router();

// GET /api/posts — Get all posts (with user + city info)
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const { rows } = await db.query(`
      SELECT 
        p.post_id,
        p.title,
        p.description,
        p.image_url,
        p.google_maps_link,
        p.price,
        p.created_at,
        u.username AS author,
        u.profile_picture_url AS author_avatar,
        c.city_name,
        co.country_name
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      JOIN cities c ON p.city_id = c.city_id
      JOIN countries co ON c.country_id = co.country_id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts — Create a new post
router.post('/', 
  // Optional: add validation with express-validator
  async (req, res) => {
    const { 
      title, 
      description, 
      cityId, 
      imageUrl, 
      googleMapsLink, 
      price 
    } = req.body;

    // Get user from JWT (add auth middleware later)
    const userId = req.user?.userId || 1; // ← TEMP: use real user later

    try {
      const db = req.app.get('db');

      const { rows } = await db.query(
        `INSERT INTO posts 
         (user_id, city_id, title, description, image_url, google_maps_link, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, cityId, title, description, imageUrl, googleMapsLink, price || null]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Create post error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;