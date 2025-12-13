const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// @route   GET /api/locations
// @desc    Get all locations (countries and cities)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        co.country_id,
        co.country_name,
        co.country_code,
        json_agg(
          json_build_object(
            'city_id', c.city_id,
            'city_name', c.city_name
          ) ORDER BY c.city_name
        ) as cities
       FROM countries co
       LEFT JOIN cities c ON co.country_id = c.country_id
       GROUP BY co.country_id, co.country_name, co.country_code
       ORDER BY co.country_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/locations/cities
// @desc    Get all cities
router.get('/cities', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.city_id, c.city_name, co.country_name
       FROM cities c
       JOIN countries co ON c.country_id = co.country_id
       ORDER BY c.city_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;