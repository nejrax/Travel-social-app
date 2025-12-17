const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'habibaibrahim',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'travelapp',
  password: process.env.DB_PASSWORD || 'strongpassword',
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
