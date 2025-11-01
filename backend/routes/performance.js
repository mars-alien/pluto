const express = require('express');
const router = express.Router();
const LearningPerformance = require('../models/LearningPerformance');
const { verifyToken } = require('../middleware/auth');

// Get user's learning performance data
router.get('/', verifyToken, async (req, res) => {
  try {
    const performance = await LearningPerformance.getOrCreate(req.userId);
    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Server error while fetching performance data' });
  }
});

// Note: Removed unused routes - only keeping the main GET route that's actually used by frontend
// If you need to track user activity in the future, you can add specific routes back

module.exports = router;
