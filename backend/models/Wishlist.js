const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  channelTitle: {
    type: String,
    default: 'Unknown Channel'
  },
  duration: {
    type: String,
    default: 'Unknown'
  },
  tags: [{
    type: String
  }],
  level: {
    type: String,
    enum: ['JUNIOR', 'SENIOR', null],
    default: null
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate wishlist entries
WishlistSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
