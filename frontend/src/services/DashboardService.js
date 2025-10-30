import API from '../api/api';

/**
 * Dashboard service for handling video and watch history operations
 */
class DashboardService {
  /**
   * Load a YouTube video for the authenticated user
   * @param {string} youtubeUrl - YouTube URL
   * @returns {Promise<Object>} - Video and watch history data
   */
  async loadVideo(youtubeUrl) {
    try {
      const response = await API.post('/dashboard/video/load', { youtubeUrl });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to load video');
    } catch (error) {
      console.error('Load video error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to load video');
    }
  }

  /**
   * Get user's watch history
   * @param {number} limit - Number of records to return
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Watch history records
   */
  async getWatchHistory(limit = 10, page = 1) {
    try {
      const response = await API.get('/dashboard/history', {
        params: { limit, page }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to get watch history');
    } catch (error) {
      console.error('Get watch history error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get watch history');
    }
  }

  /**
   * Update watch progress for a video
   * @param {string} videoId - Video ID
   * @param {number} watchedSeconds - Seconds watched
   * @param {number} totalSeconds - Total video seconds
   * @returns {Promise<Object>} - Updated watch history
   */
  async updateWatchProgress(videoId, watchedSeconds, totalSeconds = null) {
    try {
      const response = await API.post('/dashboard/history/progress', {
        videoId,
        watchedSeconds,
        totalSeconds
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update watch progress');
    } catch (error) {
      console.error('Update watch progress error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update watch progress');
    }
  }

  /**
   * Toggle bookmark status for a video
   * @param {string} videoId - Video ID
   * @param {boolean} bookmarked - Bookmark status
   * @returns {Promise<Object>} - Updated watch history
   */
  async toggleBookmark(videoId, bookmarked) {
    try {
      const response = await API.post('/dashboard/bookmarks/toggle', {
        videoId,
        bookmarked
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update bookmark');
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update bookmark');
    }
  }

  /**
   * Add notes to a video
   * @param {string} videoId - Video ID
   * @param {string} notes - Notes content
   * @returns {Promise<Object>} - Updated watch history
   */
  async addNotes(videoId, notes) {
    try {
      const response = await API.post('/dashboard/notes', {
        videoId,
        notes
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update notes');
    } catch (error) {
      console.error('Add notes error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update notes');
    }
  }

  /**
   * Rate a video
   * @param {string} videoId - Video ID
   * @param {number} rating - Rating (1-5)
   * @returns {Promise<Object>} - Updated watch history
   */
  async rateVideo(videoId, rating) {
    try {
      const response = await API.post('/dashboard/rating', {
        videoId,
        rating
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update rating');
    } catch (error) {
      console.error('Rate video error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update rating');
    }
  }

  /**
   * Get bookmarked videos
   * @param {number} limit - Number of records to return
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Bookmarked videos
   */
  async getBookmarkedVideos(limit = 10, page = 1) {
    try {
      const response = await API.get('/dashboard/bookmarks', {
        params: { limit, page }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to get bookmarked videos');
    } catch (error) {
      console.error('Get bookmarked videos error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get bookmarked videos');
    }
  }

  /**
   * Clear user's watch history
   * @returns {Promise<Object>} - Success message
   */
  async clearWatchHistory() {
    try {
      const response = await API.delete('/dashboard/history');
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to clear watch history');
    } catch (error) {
      console.error('Clear watch history error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to clear watch history');
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<DashboardStats>} - Dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await API.get('/dashboard/stats');
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to get dashboard statistics');
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get dashboard statistics');
    }
  }

  /**
   * Search YouTube videos (server-proxied)
   * @param {string} q
   * @param {Object} options
   */
  async searchYouTube(q, options = {}) {
    try {
      // Only include optional params when they have meaningful values
      const params = {
        q,
        maxResults: options.maxResults ?? 24,
        order: options.order ?? 'relevance',
        safeSearch: options.safeSearch ?? 'moderate'
      };

      if (options.pageToken) params.pageToken = options.pageToken;
      if (options.regionCode) params.regionCode = options.regionCode;
      if (options.videoDuration) params.videoDuration = options.videoDuration;
      if (options.relevanceLanguage) params.relevanceLanguage = options.relevanceLanguage;
      if (options.publishedAfter) params.publishedAfter = options.publishedAfter;

      const response = await API.get('/dashboard/youtube/search', { params });
      if (response.data.success) return response.data.data;
      throw new Error(response.data.message || 'Search failed');
    } catch (error) {
      console.error('YouTube search error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Search failed');
    }
  }
}

export default new DashboardService();
