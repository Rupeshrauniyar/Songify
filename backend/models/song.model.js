const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  audioPath: {
    type: String,
    required: true
  },
  originalVideoPath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song; 