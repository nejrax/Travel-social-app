const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
//mongoose.connect(process.env.MONGODB_URI)
  //.then(() => console.log('Connected to MongoDB'))
  //.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/locations', locationRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});