import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLayout from '../components/PageLayout';
import WishlistService from '../services/WishlistService';
import DashboardService from '../services/DashboardService';
import './Wishlist.css';

export default function Wishlist() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [wishlistData, historyData] = await Promise.all([
        WishlistService.getWishlist().catch(() => []),
        WishlistService.getWatchHistory().catch(() => [])
      ]);
      setWishlist(wishlistData || []);
      setWatchHistory(historyData || []);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveFromWishlist = async (videoId) => {
    try {
      await WishlistService.removeFromWishlist(videoId);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err.message || 'Failed to remove from wishlist');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await WishlistService.clearWishlist();
        await loadData(); // Refresh data
      } catch (err) {
        setError(err.message || 'Failed to clear wishlist');
      }
    }
  };

  const handleClearWatchHistory = async () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      try {
        await WishlistService.clearWatchHistory();
        await loadData(); // Refresh data
      } catch (err) {
        setError(err.message || 'Failed to clear watch history');
      }
    }
  };

  const handlePlayVideo = async (video) => {
    try {
      const url = `https://www.youtube.com/watch?v=${video.videoId}`;
      const result = await DashboardService.loadVideo(url);
      
      // Navigate to editor with video
      navigate(`/dashboard/editor/${video.videoId}`, { 
        state: { 
          video: result.video,
          url: url
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to load video');
    }
  };

  const calculateProgress = (watchedSeconds, totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return 0;
    return Math.round((watchedSeconds / totalSeconds) * 100);
  };

  const renderWishlistGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {(items || []).map((v) => (
        <div key={v.id || v._id || v.videoId} className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-green-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:border-green-300 cursor-pointer relative min-h-[240px]">
          <div className="relative" onClick={() => handlePlayVideo(v)}>
            <img
              alt={v.title || ''}
              className="w-full aspect-video object-cover h-[180px]"
              src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`}
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">▶</span>
              </div>
            </div>
            {v.duration && v.duration !== "Unknown" && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {v.duration}
              </div>
            )}
            
            {/* Remove button in top-right corner */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromWishlist(v.videoId);
              }}
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 z-20 shadow-lg border-2 border-white"
              title="Remove from Wishlist"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
              {v.title || 'YouTube Video'}
            </h4>
            <p className="text-xs text-gray-600">
              {v.channel || v.channelTitle || 'Unknown Channel'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWatchHistoryGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {(items || []).map((v) => {
        const progress = calculateProgress(v.watchedSeconds, v.totalSeconds);
        return (
          <div key={v.id || v._id || v.videoId} className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:border-blue-300 cursor-pointer relative min-h-[240px]">
            <div className="relative" onClick={() => handlePlayVideo(v)}>
              <img
                alt={v.title || ''}
                className="w-full aspect-video object-cover h-[180px]"
                src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`}
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl">▶</span>
                </div>
              </div>
              {v.duration && v.duration !== "Unknown" && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {v.duration}
                </div>
              )}
              
              {/* Progress indicator */}
              {progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
                {v.title || 'YouTube Video'}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {v.channel || v.channelTitle || 'Unknown Channel'}
              </p>
              
              {progress > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {progress}% watched
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <PageLayout 
      showBackButton 
      backTo="/dashboard"
      onLogout={handleLogout} 
      headerRight={null}
      className="bg-white"
    >
      {/* Animated mesh gradient background - same as Dashboard */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top left */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob"
             style={{background: 'linear-gradient(96deg, rgba(254, 245, 113, 0.5) 0%, rgba(174, 255, 168, 0.5) 29.94%, rgba(143, 255, 206, 0.5) 66.98%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
        
        {/* Top right */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
             style={{background: 'linear-gradient(45deg, rgba(143, 255, 206, 0.4) 0%, rgba(153, 247, 255, 0.4) 50%, rgba(174, 255, 168, 0.4) 100%)'}}></div>
        
        {/* Bottom left */}
        <div className="absolute -bottom-24 -left-24 w-[650px] h-[650px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
             style={{background: 'linear-gradient(135deg, rgba(174, 255, 168, 0.45) 0%, rgba(143, 255, 206, 0.45) 100%)'}}></div>
        
        {/* Bottom right */}
        <div className="absolute -bottom-16 -right-16 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"
             style={{background: 'linear-gradient(225deg, rgba(153, 247, 255, 0.4) 0%, rgba(174, 255, 168, 0.4) 100%)'}}></div>
        
        {/* Center bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-7000"
             style={{background: 'linear-gradient(60deg, rgba(143, 255, 206, 0.45) 28.41%, rgba(153, 247, 255, 0.45) 69.04%)'}}></div>
        
        {/* Center orb for blending */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-500"
             style={{background: 'linear-gradient(96deg, rgba(174, 255, 168, 0.4) 0%, rgba(143, 255, 206, 0.4) 50%, rgba(153, 247, 255, 0.4) 100%)'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8 px-4 py-6">
        {/* Wishlist Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">💝 My Wishlist</h1>
            {wishlist.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          {loading && <div className="text-center py-8">Loading wishlist...</div>}
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          
          {!loading && wishlist.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Your wishlist is empty</p>
              <p className="text-sm">Start adding videos by clicking the heart icon when searching!</p>
            </div>
          )}
          
          {!loading && wishlist.length > 0 && renderWishlistGrid(wishlist)}
        </div>

        {/* Watch History Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">📺 Watch History</h2>
            {watchHistory.length > 0 && (
              <button
                onClick={handleClearWatchHistory}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          {!loading && watchHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No watch history yet</p>
              <p className="text-sm">Videos you watch will appear here</p>
            </div>
          )}
          
          {!loading && watchHistory.length > 0 && renderWatchHistoryGrid(watchHistory)}
        </div>
      </div>

    </PageLayout>
  );
}


