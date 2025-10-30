const mongoose = require('mongoose');
const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');
const YouTubeService = require('./YouTubeService');

class DashboardService {
  /**
   * Load and process a YouTube video for a user
   * @param {string} userId - User ID
   * @param {string} youtubeUrl - YouTube URL
   * @returns {Promise<Object>} - Processed video data with watch history
   */
  async loadVideo(userId, youtubeUrl) {
    try {
      // Process the YouTube URL
      const videoData = await YouTubeService.processVideoUrl(youtubeUrl);
      
      // Find or create video record
      const video = await Video.findOrCreate({
        videoId: videoData.videoId,
        title: videoData.title,
        channel: videoData.channel,
        thumbnail: videoData.thumbnail,
        description: videoData.description || ""
      });

      // Find or create watch history record
      const watchHistory = await WatchHistory.findOrCreate(userId, videoData.videoId, {
        videoId: videoData.videoId,
        title: videoData.title,
        channel: videoData.channel,
        thumbnail: videoData.thumbnail
      });

      return {
        video: {
          _id: video._id,
          videoId: video.videoId,
          title: video.title,
          channel: video.channel,
          thumbnail: video.thumbnail,
          embedUrl: videoData.embedUrl,
          youtubeUrl: videoData.youtubeUrl
        },
        watchHistory: {
          _id: watchHistory._id,
          watchedSeconds: watchHistory.watchedSeconds,
          totalSeconds: watchHistory.totalSeconds,
          progressPercentage: watchHistory.progressPercentage,
          lastWatchedAt: watchHistory.lastWatchedAt,
          watchCount: watchHistory.watchCount,
          completed: watchHistory.completed,
          bookmarked: watchHistory.bookmarked
        }
      };
    } catch (error) {
      throw new Error(`Failed to load video: ${error.message}`);
    }
  }

  /**
   * Get user's watch history
   * @param {string} userId - User ID
   * @param {number} limit - Number of records to return
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Watch history records
   */
  async getWatchHistory(userId, limit = 10, page = 1) {
    try {
      const watchHistory = await WatchHistory.getUserHistory(userId, limit, page);
      
      return watchHistory.map(record => ({
        _id: record._id,
        videoId: record.videoId,
        title: record.video?.title || "Unknown",
        channel: record.video?.channel || "Unknown",
        thumbnail: record.video?.thumbnail || "",
        duration: record.video?.duration || "Unknown",
        watchedSeconds: record.watchedSeconds,
        totalSeconds: record.totalSeconds,
        progressPercentage: record.progressPercentage,
        lastWatchedAt: record.lastWatchedAt,
        watchCount: record.watchCount,
        completed: record.completed,
        bookmarked: record.bookmarked,
        notes: record.notes,
        rating: record.rating
      }));
    } catch (error) {
      throw new Error(`Failed to get watch history: ${error.message}`);
    }
  }

  /**
   * Update watch progress for a video
   * @param {string} userId - User ID
   * @param {string} videoId - Video ID
   * @param {number} watchedSeconds - Seconds watched
   * @param {number} totalSeconds - Total video seconds
   * @returns {Promise<Object>} - Updated watch history
   */
  async updateWatchProgress(userId, videoId, watchedSeconds, totalSeconds = null) {
    try {
      const watchHistory = await WatchHistory.updateProgress(
        userId, 
        videoId, 
        watchedSeconds, 
        totalSeconds
      );

      if (!watchHistory) {
        throw new Error('Watch history record not found');
      }

      return {
        _id: watchHistory._id,
        watchedSeconds: watchHistory.watchedSeconds,
        totalSeconds: watchHistory.totalSeconds,
        progressPercentage: watchHistory.progressPercentage,
        completed: watchHistory.completed,
        lastWatchedAt: watchHistory.lastWatchedAt
      };
    } catch (error) {
      throw new Error(`Failed to update watch progress: ${error.message}`);
    }
  }

  /**
   * Bookmark or unbookmark a video
   * @param {string} userId - User ID
   * @param {string} videoId - Video ID
   * @param {boolean} bookmarked - Bookmark status
   * @returns {Promise<Object>} - Updated watch history
   */
  async toggleBookmark(userId, videoId, bookmarked) {
    try {
      const watchHistory = await WatchHistory.findOne({ user: userId, videoId });
      
      if (!watchHistory) {
        throw new Error('Watch history record not found');
      }

      watchHistory.bookmarked = bookmarked;
      await watchHistory.save();

      return {
        _id: watchHistory._id,
        bookmarked: watchHistory.bookmarked
      };
    } catch (error) {
      throw new Error(`Failed to update bookmark: ${error.message}`);
    }
  }

  /**
   * Add notes to a video
   * @param {string} userId - User ID
   * @param {string} videoId - Video ID
   * @param {string} notes - Notes content
   * @returns {Promise<Object>} - Updated watch history
   */
  async addNotes(userId, videoId, notes) {
    try {
      const watchHistory = await WatchHistory.findOne({ user: userId, videoId });
      
      if (!watchHistory) {
        throw new Error('Watch history record not found');
      }

      watchHistory.notes = notes;
      await watchHistory.save();

      return {
        _id: watchHistory._id,
        notes: watchHistory.notes
      };
    } catch (error) {
      throw new Error(`Failed to update notes: ${error.message}`);
    }
  }

  /**
   * Rate a video
   * @param {string} userId - User ID
   * @param {string} videoId - Video ID
   * @param {number} rating - Rating (1-5)
   * @returns {Promise<Object>} - Updated watch history
   */
  async rateVideo(userId, videoId, rating) {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const watchHistory = await WatchHistory.findOne({ user: userId, videoId });
      
      if (!watchHistory) {
        throw new Error('Watch history record not found');
      }

      watchHistory.rating = rating;
      await watchHistory.save();

      return {
        _id: watchHistory._id,
        rating: watchHistory.rating
      };
    } catch (error) {
      throw new Error(`Failed to update rating: ${error.message}`);
    }
  }

  /**
   * Get bookmarked videos
   * @param {string} userId - User ID
   * @param {number} limit - Number of records to return
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Bookmarked videos
   */
  async getBookmarkedVideos(userId, limit = 10, page = 1) {
    try {
      const bookmarkedVideos = await WatchHistory.getBookmarkedVideos(userId, limit, page);
      
      return bookmarkedVideos.map(record => ({
        _id: record._id,
        videoId: record.videoId,
        title: record.video?.title || "Unknown",
        channel: record.video?.channel || "Unknown",
        thumbnail: record.video?.thumbnail || "",
        duration: record.video?.duration || "Unknown",
        watchedSeconds: record.watchedSeconds,
        totalSeconds: record.totalSeconds,
        progressPercentage: record.progressPercentage,
        lastWatchedAt: record.lastWatchedAt,
        notes: record.notes,
        rating: record.rating
      }));
    } catch (error) {
      throw new Error(`Failed to get bookmarked videos: ${error.message}`);
    }
  }

  /**
   * Clear user's watch history
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async clearWatchHistory(userId) {
    try {
      await WatchHistory.deleteMany({ user: userId });
      return { message: 'Watch history cleared successfully' };
    } catch (error) {
      throw new Error(`Failed to clear watch history: ${error.message}`);
    }
  }

  /**
   * Get dashboard statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Dashboard statistics
   */
  async getDashboardStats(userId) {
    try {
      const totalVideos = await WatchHistory.countDocuments({ user: userId });
      const completedVideos = await WatchHistory.countDocuments({ user: userId, completed: true });
      const bookmarkedVideos = await WatchHistory.countDocuments({ user: userId, bookmarked: true });
      
      // Get total watch time
      const watchTimeResult = await WatchHistory.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalWatchTime: { $sum: '$watchedSeconds' } } }
      ]);

      const totalWatchTime = watchTimeResult.length > 0 ? watchTimeResult[0].totalWatchTime : 0;

      return {
        totalVideos,
        completedVideos,
        bookmarkedVideos,
        totalWatchTime,
        averageProgress: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }
}

module.exports = new DashboardService();
