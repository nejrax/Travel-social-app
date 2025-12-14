// server.js
require('dotenv').config();

// ✅ ESSENTIAL: Import dependencies FIRST
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const locationRoutes = require('./routes/locations');
const auth = require('./middleware/auth');  // ✅ CORRECT

// Create app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'TravelApp',  
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'nejra1',
});

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection FAILED:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL at:', new Date(res.rows[0].now).toLocaleString());
  }
});

// Make pool available to routes
app.set('db', pool);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/locations', locationRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: '✅ TravelConnect API is running!', time: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
