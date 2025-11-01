const mongoose = require('mongoose');
const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');
const Bookmark = require('../models/Bookmark');
const YouTubeService = require('./YouTubeService');

class DashboardService {
 
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

      // Find or create watch history record (only when video is actually being watched)
      const watchHistory = await WatchHistory.findOrCreate(userId, videoData.videoId, {
        videoId: videoData.videoId,
        title: videoData.title,
        channel: videoData.channel,
        thumbnail: videoData.thumbnail
      });

      // Check if video is bookmarked
      const isBookmarked = await Bookmark.isBookmarked(userId, videoData.videoId);

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
          bookmarked: isBookmarked // Get from separate Bookmark model
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
      
      // Get all video IDs to check bookmark status
      const videoIds = watchHistory.map(record => record.videoId);
      const bookmarkedVideoIds = await Promise.all(
        videoIds.map(async (videoId) => {
          const isBookmarked = await Bookmark.isBookmarked(userId, videoId);
          return { videoId, isBookmarked };
        })
      );
      
      const bookmarkMap = bookmarkedVideoIds.reduce((map, item) => {
        map[item.videoId] = item.isBookmarked;
        return map;
      }, {});
      
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
        bookmarked: bookmarkMap[record.videoId] || false, // Get from Bookmark model
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
      // Get video data for watch history
      const video = await Video.findOne({ videoId });
      if (!video) {
        throw new Error('Video not found');
      }

      // First try to find existing record
      let watchHistory = await WatchHistory.findOne({ user: userId, videoId });
      
      if (watchHistory) {
        // Update existing record
        watchHistory = await WatchHistory.findOneAndUpdate(
          { user: userId, videoId },
          {
            $set: {
              watchedSeconds: watchedSeconds,
              ...(totalSeconds && { totalSeconds: totalSeconds }),
              lastWatchedAt: new Date()
            },
            $inc: {
              watchCount: 1
            }
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create new record
        try {
          watchHistory = new WatchHistory({
            user: userId,
            video: video._id,
            videoId: videoId,
            watchedSeconds: watchedSeconds,
            ...(totalSeconds && { totalSeconds: totalSeconds }),
            lastWatchedAt: new Date(),
            watchCount: 1
          });
          await watchHistory.save();
        } catch (error) {
          // If duplicate key error (race condition), try to find existing record
          if (error.code === 11000) {
            watchHistory = await WatchHistory.findOneAndUpdate(
              { user: userId, videoId },
              {
                $set: {
                  watchedSeconds: watchedSeconds,
                  ...(totalSeconds && { totalSeconds: totalSeconds }),
                  lastWatchedAt: new Date()
                },
                $inc: {
                  watchCount: 1
                }
              },
              { new: true, runValidators: true }
            );
            
            if (!watchHistory) {
              throw new Error('Failed to create or update watch history record');
            }
          } else {
            throw error;
          }
        }
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
   * @returns {Promise<Object>} - Updated bookmark status
   */
  async toggleBookmark(userId, videoId, bookmarked) {
    try {
      if (bookmarked) {
        // Add bookmark
        let video = await Video.findOne({ videoId });
        if (!video) {
          // Fetch video metadata for required fields
          const videoData = await YouTubeService.fetchVideoMetadata(videoId);
          video = new Video({
            videoId,
            title: videoData.title || "Unknown",
            channel: videoData.channel || "Unknown",
            thumbnail: videoData.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            description: videoData.description || ""
          });
          await video.save();
        }

        const bookmark = await Bookmark.addBookmark(userId, videoId, {
          videoId,
          title: video.title,
          channel: video.channel,
          thumbnail: video.thumbnail
        });

        return {
          _id: bookmark._id,
          bookmarked: true
        };
      } else {
        // Remove bookmark
        await Bookmark.removeBookmark(userId, videoId);
        return {
          bookmarked: false
        };
      }
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
      throw new Error(`Failed to update rating: ${error.message}`);
    }
  }
   * @param {number} limit - Number of records to return
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Bookmarked videos
   */
  async getBookmarkedVideos(userId, limit = 20, page = 1) {
    try {
      const bookmarkedVideos = await Bookmark.getUserBookmarks(userId, limit, page);
      
      return bookmarkedVideos.map(record => ({
        _id: record._id,
        videoId: record.videoId,
        title: record.video?.title || "Unknown",
        channel: record.video?.channel || "Unknown",
        thumbnail: record.video?.thumbnail || "",
        duration: record.video?.duration || "Unknown",
        bookmarkedAt: record.bookmarkedAt,
        notes: record.notes,
        tags: record.tags,
        folder: record.folder,
        favorited: true // Always true for bookmarked videos
      }));
    } catch (error) {
      throw new Error(`Failed to get bookmarked videos: ${error.message}`);
    }
  }

  /**
   * Check bookmark status for multiple videos
   * @param {string} userId - User ID
   * @param {Array} videoIds - Array of video IDs to check
   * @returns {Promise<Object>} - Bookmark status map
   */
  async checkBookmarkStatus(userId, videoIds) {
    try {
      const bookmarkStatus = {};
      
      // Get all bookmarks for the user
      const bookmarks = await Bookmark.find({ user: userId, videoId: { $in: videoIds } });
      
      // Create a map of videoId -> bookmark status
      videoIds.forEach(videoId => {
        bookmarkStatus[videoId] = bookmarks.some(bookmark => bookmark.videoId === videoId);
      });
      
      return bookmarkStatus;
    } catch (error) {
      throw new Error(`Failed to check bookmark status: ${error.message}`);
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
      const bookmarkedVideos = await Bookmark.countDocuments({ user: userId }); // Use Bookmark model
      
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
