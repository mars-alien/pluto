const DashboardService = require('../services/DashboardService');
const YouTubeService = require('../services/YouTubeService');

/**
 * Load a YouTube video for the authenticated user
 */
exports.loadVideo = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    const userId = req.userId;

    if (!youtubeUrl) {
      return res.status(400).json({ message: "YouTube URL is required" });
    }

    if (!YouTubeService.isValidYoutubeUrl(youtubeUrl)) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    const result = await DashboardService.loadVideo(userId, youtubeUrl);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Load video error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to load video"
    });
  }
};

/**
 * Get user's watch history
 */
exports.getWatchHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10, page = 1 } = req.query;

    const watchHistory = await DashboardService.getWatchHistory(
      userId, 
      parseInt(limit), 
      parseInt(page)
    );
    
    res.json({
      success: true,
      data: watchHistory
    });
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to get watch history"
    });
  }
};

/**
 * Update watch progress for a video
 */
exports.updateWatchProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId, watchedSeconds, totalSeconds } = req.body;

    if (!videoId || watchedSeconds === undefined) {
      return res.status(400).json({ message: "Video ID and watched seconds are required" });
    }

    const result = await DashboardService.updateWatchProgress(
      userId, 
      videoId, 
      watchedSeconds, 
      totalSeconds
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Update watch progress error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update watch progress"
    });
  }
};

/**
 * Toggle bookmark status for a video
 */
exports.toggleBookmark = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId, bookmarked } = req.body;

    if (!videoId || typeof bookmarked !== 'boolean') {
      return res.status(400).json({ message: "Video ID and bookmark status are required" });
    }

    const result = await DashboardService.toggleBookmark(userId, videoId, bookmarked);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update bookmark"
    });
  }
};

/**
 * Add notes to a video
 */
exports.addNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId, notes } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const result = await DashboardService.addNotes(userId, videoId, notes || "");
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Add notes error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update notes"
    });
  }
};

/**
 * Rate a video
 */
exports.rateVideo = async (req, res) => {
  try {
    const userId = req.userId;
    const { videoId, rating } = req.body;

    if (!videoId || !rating) {
      return res.status(400).json({ message: "Video ID and rating are required" });
    }

    const result = await DashboardService.rateVideo(userId, videoId, rating);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Rate video error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update rating"
    });
  }
};

/**
 * Get bookmarked videos
 */
exports.getBookmarkedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10, page = 1 } = req.query;

    const bookmarkedVideos = await DashboardService.getBookmarkedVideos(
      userId, 
      parseInt(limit), 
      parseInt(page)
    );
    
    res.json({
      success: true,
      data: bookmarkedVideos
    });
  } catch (error) {
    console.error('Get bookmarked videos error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to get bookmarked videos"
    });
  }
};

/**
 * Clear user's watch history
 */
exports.clearWatchHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await DashboardService.clearWatchHistory(userId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clear watch history error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to clear watch history"
    });
  }
};

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await DashboardService.getDashboardStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to get dashboard statistics"
    });
  }
};


/**
 * YouTube Search proxy (YouTube Data API v3)
 */
exports.searchYouTube = async (req, res) => {
  try {
    const {
      q,
      pageToken = '',
      maxResults = 24,
      order = 'relevance',
      safeSearch = 'moderate',
      regionCode = '',
      videoDuration = '',
      relevanceLanguage = '',
      publishedAfter = ''
    } = req.query;

    if (!q || !q.toString().trim()) {
      return res.status(400).json({ message: 'Missing query param: q' });
    }

    const data = await YouTubeService.searchVideos({
      q,
      pageToken,
      maxResults: Number(maxResults) || 24,
      order,
      safeSearch,
      regionCode,
      videoDuration,
      relevanceLanguage,
      publishedAfter
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'YouTube search failed' });
  }
};
