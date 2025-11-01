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

// Bookmark routes
router.get('/bookmarks', dashboardController.getBookmarkedVideos);
router.post('/bookmarks/toggle', dashboardController.toggleBookmark);
router.post('/bookmarks/check', dashboardController.checkBookmarkStatus);

// Notes and rating routes
router.post('/notes', dashboardController.addNotes);
router.post('/rating', dashboardController.rateVideo);

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
