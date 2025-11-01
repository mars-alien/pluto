const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const WatchHistory = require('../models/WatchHistory');
const { verifyToken } = require('../middleware/auth');

// Get user's wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.userId })
      .sort({ addedAt: -1 })
      .limit(50);
    
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to wishlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle, duration, tags, level } = req.body;
    
    if (!videoId || !title || !thumbnail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if video already exists in wishlist
    const existingWishlistItem = await Wishlist.findOne({ 
      userId: req.userId, 
      videoId 
    });

    if (existingWishlistItem) {
      return res.status(409).json({ message: 'Video already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userId: req.userId,
      videoId,
      title,
      thumbnail,
      channelTitle: channelTitle || 'Unknown Channel',
      duration: duration || 'Unknown',
      tags: tags || [],
      level
    });

    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Video already in wishlist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove video from wishlist
router.delete('/:videoId', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const result = await Wishlist.findOneAndDelete({ 
      userId: req.userId, 
      videoId 
    });

    if (!result) {
      return res.status(404).json({ message: 'Video not found in wishlist' });
    }

    res.json({ message: 'Video removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear entire wishlist
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await Wishlist.deleteMany({ userId: req.userId });
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's watch history (from WatchHistory model)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const watchHistory = await WatchHistory.find({ userId: req.userId })
      .sort({ lastWatchedAt: -1 })
      .limit(50);
    
    res.json(watchHistory);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear watch history
router.delete('/history/clear', verifyToken, async (req, res) => {
  try {
    await WatchHistory.deleteMany({ userId: req.userId });
    res.json({ message: 'Watch history cleared' });
  } catch (error) {
    console.error('Error clearing watch history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
