const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const fileArg = process.argv[2] || 'passwords.json';
  const filePath = path.resolve(process.cwd(), fileArg);

  if (!fs.existsSync(filePath)) {
    console.error('Passwords file not found:', filePath);
    process.exit(1);
  }

  let list;
  try {
    list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Failed to parse passwords file:', err.message);
    process.exit(1);
  }

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  for (const entry of list) {
    const { email, password } = entry;
    if (!email || !password) {
      console.warn('Skipping invalid entry', entry);
      continue;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const res = await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING user_id, email',
        [hash, email]
      );

      if (res.rowCount === 0) {
        console.warn(`No user found with email ${email}`);
      } else {
        console.log(`Updated password for ${email}`);
      }
    } catch (err) {
      console.error(`Error updating ${email}:`, err.message);
    }
  }

  await pool.end();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
