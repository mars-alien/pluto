class WishlistService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 
      (import.meta.env.DEV 
        ? "http://localhost:5000/api" 
        : "https://pluto-backend-dk2u.onrender.com/api");
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async addToWishlist(video) {
    try {
      const response = await fetch(`${this.baseURL}/wishlist`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          videoId: video.videoId,
          title: video.title,
          thumbnail: video.thumbnail,
          channelTitle: video.channelTitle,
          duration: video.duration,
          tags: video.tags || [],
          level: video.level
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to wishlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(videoId) {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/${videoId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove from wishlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  async getWishlist() {
    try {
      const response = await fetch(`${this.baseURL}/wishlist`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch wishlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  async clearWishlist() {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/clear`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear wishlist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  async getWatchHistory() {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/history`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch watch history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching watch history:', error);
      throw error;
    }
  }

  async clearWatchHistory() {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/history/clear`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear watch history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing watch history:', error);
      throw error;
    }
  }
}

export default new WishlistService();
