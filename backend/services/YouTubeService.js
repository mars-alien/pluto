const axios = require('axios');

class YouTubeService {
  constructor() {
    this.baseUrl = 'https://www.youtube.com/oembed';
    // Support both names to avoid misconfiguration
    this.apiKey = process.env.YOUTUBE_API_KEY || process.env.YT_API_KEY || '';
  }

  /**
   * Extract video ID from various YouTube URL formats
   * @param {string} url - YouTube URL
   * @returns {string|null} - Video ID or null if invalid
   */
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Validate if URL is a valid YouTube URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid YouTube URL
   */
  isValidYoutubeUrl(url) {
    return this.extractVideoId(url) !== null;
  }

  /**
   * Fetch video metadata using YouTube oEmbed API
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} - Video metadata
   */
  async fetchVideoMetadata(videoId) {
    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          url: `https://www.youtube.com/watch?v=${videoId}`,
          format: 'json'
        },
        timeout: 10000
      });

      if (response.status === 200 && response.data) {
        return {
          title: response.data.title || "YouTube Video",
          channel: response.data.author_name || "Unknown",
          thumbnail: response.data.thumbnail_url || this.getDefaultThumbnail(videoId),
          description: response.data.description || "",
          html: response.data.html || ""
        };
      }
      
      throw new Error('Invalid response from YouTube API');
    } catch (error) {
      console.error('YouTube metadata fetch error:', error.message);
      
      // Return fallback data
      return {
        title: "YouTube Video",
        channel: "Unknown",
        thumbnail: this.getDefaultThumbnail(videoId),
        description: "",
        html: ""
      };
    }
  }

  /**
   * Get default thumbnail URL for a video ID
   * @param {string} videoId - YouTube video ID
   * @returns {string} - Thumbnail URL
   */
  getDefaultThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Get embed URL for a video ID
   * @param {string} videoId - YouTube video ID
   * @param {Object} options - Embed options
   * @returns {string} - Embed URL
   */
  getEmbedUrl(videoId, options = {}) {
    const defaultOptions = {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      ...options
    };

    const params = new URLSearchParams(defaultOptions);
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  /**
   * Process YouTube URL and return complete video data
   * @param {string} youtubeUrl - YouTube URL
   * @returns {Promise<Object>} - Complete video data
   */
  async processVideoUrl(youtubeUrl) {
    if (!this.isValidYoutubeUrl(youtubeUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    const videoId = this.extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    const metadata = await this.fetchVideoMetadata(videoId);
    
    return {
      videoId,
      youtubeUrl,
      embedUrl: this.getEmbedUrl(videoId),
      ...metadata,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Get video statistics (if API key is available)
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} - Video statistics
   */
  async getVideoStatistics(videoId) {
    if (!this.apiKey) {
      return {
        viewCount: 0,
        likeCount: 0,
        duration: "Unknown"
      };
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics,contentDetails',
          id: videoId,
          key: this.apiKey
        },
        timeout: 10000
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          viewCount: parseInt(video.statistics.viewCount) || 0,
          likeCount: parseInt(video.statistics.likeCount) || 0,
          duration: video.contentDetails.duration || "Unknown"
        };
      }
    } catch (error) {
      console.error('YouTube statistics fetch error:', error.message);
    }

    return {
      viewCount: 0,
      likeCount: 0,
      duration: "Unknown"
    };
  }

  /**
   * Search YouTube videos using Data API v3
   * @param {Object} opts
   * @param {string} opts.q - query
   * @param {string} [opts.pageToken]
   * @param {number} [opts.maxResults]
   * @param {string} [opts.order]
   * @param {string} [opts.safeSearch]
   * @param {string} [opts.regionCode]
   * @param {string} [opts.videoDuration]
   * @param {string} [opts.relevanceLanguage]
   * @param {string} [opts.publishedAfter]
   * @returns {Promise<Object>} normalized search results
   */
  async searchVideos(opts = {}) {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured. Please set YOUTUBE_API_KEY or YT_API_KEY environment variable.');
    }

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
    } = opts;

    if (!q || !q.toString().trim()) {
      throw new Error('Missing search query');
    }

    // Build params, only including optional fields when valid
    const params = {
      key: this.apiKey,
      part: 'snippet',
      type: 'video',
      q: q.toString().trim(),
      maxResults,
      order,
      safeSearch
    };

    if (regionCode) params.regionCode = regionCode;
    if (pageToken) params.pageToken = pageToken;

    // Only include videoDuration if valid (any | short | medium | long)
    if (videoDuration && ['any', 'short', 'medium', 'long'].includes(String(videoDuration))) {
      params.videoDuration = videoDuration;
    }
    if (relevanceLanguage) params.relevanceLanguage = relevanceLanguage;

    if (publishedAfter) {
      const str = String(publishedAfter);
      // Accept already valid RFC3339 timestamps or try to convert to ISO8601 Z
      const looksValid = /Z$|[+\-]\d{2}:\d{2}$/.test(str);
      const iso = looksValid ? str : new Date(str).toISOString();
      if (!Number.isNaN(Date.parse(iso))) {
        params.publishedAfter = iso;
      }
    }

    try {
      const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params,
        timeout: 10000
      });

      const items = (data.items || [])
        .map(({ id, snippet }) => ({
          videoId: id?.videoId,
          title: snippet?.title,
          description: snippet?.description,
          channelTitle: snippet?.channelTitle,
          publishedAt: snippet?.publishedAt,
          thumbnail: snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url,
        }))
        .filter(v => v.videoId);

      return {
        items,
        nextPageToken: data.nextPageToken || null,
        prevPageToken: data.prevPageToken || null,
        totalResults: data.pageInfo?.totalResults ?? null,
      };
    } catch (error) {
      console.error('YouTube search error:', error.response?.data || error.message);
      
      // Provide detailed error messages
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.error?.message || 'YouTube API key is invalid or quota exceeded';
        throw new Error(`YouTube API access denied: ${errorMessage}`);
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error?.message || 'Invalid request parameters';
        throw new Error(`Invalid request: ${errorMessage}`);
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('YouTube API request timed out. Please try again.');
      } else if (error.response?.data?.error) {
        const errorMessage = error.response.data.error.message || 'YouTube API error';
        throw new Error(`YouTube API error: ${errorMessage}`);
      }
      
      throw new Error(error.message || 'YouTube search failed. Please check your internet connection and try again.');
    }
  }
}

module.exports = new YouTubeService();
