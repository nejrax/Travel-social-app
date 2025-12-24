const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const locationRoutes = require('./routes/locations');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

const ensureDbSchema = async () => {
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT");
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT");

  await pool.query(`CREATE TABLE IF NOT EXISTS follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    followed_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_follows_follower_followed UNIQUE (follower_id, followed_id),
    CONSTRAINT chk_follows_no_self CHECK (follower_id != followed_id)
  )`);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_follows_followed ON follows(followed_id)');
};

const startServer = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected at:', res.rows[0].now);

    await ensureDbSchema();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/locations', locationRoutes);
    app.use('/api/notifications', notificationRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();