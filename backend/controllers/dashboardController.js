const DashboardService = require('../services/DashboardService');
const YouTubeService = require('../services/YouTubeService');
const { blacklist, whitelist } = require('../config/videoFilters');


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
      safeSearch = 'strict',
      regionCode = '',
      videoDuration = '',
      relevanceLanguage = '',
      publishedAfter = ''
    } = req.query;

    if (!q || !q.toString().trim()) {
      return res.status(400).json({ message: 'Missing query param: q' });
    }

    const lowerQ = String(q).toLowerCase();

    if (blacklist.some(token => lowerQ.includes(token))) {
      return res.json({
        success: true,
        data: {
          items: [],
          nextPageToken: null,
          prevPageToken: null,
          totalResults: 0,
          disclaimer: 'Search results for entertainment content are suppressed. Pluto focuses on developer/educational videos. If you intended to search for developer content, try queries like "react tutorial", "javascript coding", or "web development".'
        }
      });
    }

    // Perform the YouTube search
    const data = await YouTubeService.searchVideos({
      q,
      pageToken,
      maxResults: Number(maxResults) || 12,
      order,
      safeSearch,
      regionCode,
      videoDuration,
      relevanceLanguage,
      publishedAfter
    });

    const filteredItems = (data.items || []).filter(item => {
      const text = `${item.title || ''} ${item.description || ''} ${item.channelTitle || ''}`.toLowerCase();
      return whitelist.some(k => text.includes(k));
    });

    if (!filteredItems.length) {
      return res.json({
        success: true,
        data: {
          items: [],
          nextPageToken: null,
          prevPageToken: null,
          totalResults: 0,
          disclaimer: 'No developer/educational videos found for your query. Try searching for terms like "react tutorial", "javascript", "coding" or "web development".'
        }
      });
    }

    res.json({
      success: true,
      data: {
        items: filteredItems,
        nextPageToken: data.nextPageToken || null,
        prevPageToken: data.prevPageToken || null,
        totalResults: filteredItems.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'YouTube search failed' });
  }
};
