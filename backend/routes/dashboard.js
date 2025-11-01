const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Public: YouTube Search (no auth needed)
router.get('/youtube/search', dashboardController.searchYouTube);

// Apply authentication middleware to all remaining dashboard routes
router.use(verifyToken);

// Video management routes
router.post('/video/load', dashboardController.loadVideo);

// Watch history routes
router.get('/history', dashboardController.getWatchHistory);
router.post('/history/progress', dashboardController.updateWatchProgress);
router.delete('/history', dashboardController.clearWatchHistory);

// Removed unused routes:
// - Bookmark routes (getBookmarkedVideos, toggleBookmark, checkBookmarkStatus)
// - Notes and rating routes (addNotes, rateVideo) 
// - Dashboard statistics (getDashboardStats)
// These features are not implemented in the frontend

module.exports = router;
