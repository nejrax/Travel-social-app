const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/locations', locationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});