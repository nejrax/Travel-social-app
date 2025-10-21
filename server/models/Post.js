const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  googleMapsLink: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);