import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import './YouTubeSearch.css';

export default function YouTubeSearch({ onPick, onAddToWishlist, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [wishlistedVideos, setWishlistedVideos] = useState(new Set());

  const fetchPage = async (pageToken = '') => {
    const query = q.trim();
    if (!query) {
      setResults([]); 
      setNextPageToken(null); 
      setPrevPageToken(null); 
      setErr(''); 
      setDisclaimer('');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const data = await DashboardService.searchYouTube(query, { pageToken, maxResults: 12 });
      setResults(data.items || []);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
      setDisclaimer(data.disclaimer || '');
    } catch (e) {
      setErr(e.message || 'Search failed');
      setDisclaimer('');
    } finally {
      setLoading(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (video) => {
    try {
      if (wishlistedVideos.has(video.videoId)) {
        // Remove from wishlist (if needed)
        setWishlistedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(video.videoId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await onAddToWishlist?.(video);
        setWishlistedVideos(prev => new Set(prev).add(video.videoId));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => { fetchPage(''); }, 350);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-br from-green-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-sm rounded-xl sm:rounded-2xl px-6 py-6 sm:px-12 sm:py-8 border border-green-200/50 shadow-xl w-full max-w-6xl mx-auto">
        <div className="space-y-6 w-full">
          <form className="flex flex-col sm:flex-row items-center justify-center w-full gap-3 sm:gap-6" onSubmit={e => {e.preventDefault(); fetchPage('');}}>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search YouTube…"
              className="w-full sm:w-auto sm:flex-1 sm:max-w-2xl px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg text-gray-700 placeholder-gray-400 shadow-sm bg-white/80"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-green-500 text-white font-medium text-lg transition-all duration-200 hover:bg-green-600 disabled:opacity-60 shadow-sm"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>

          {err && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-700">{err}</p>
            </div>
          )}

          {disclaimer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
              <span className="text-blue-600">ℹ️</span>
              <div>
                <p className="text-sm text-blue-800 font-semibold">Notice</p>
                <p className="text-sm text-blue-700">{disclaimer}</p>
              </div>
            </div>
          )}

          <div className="youtube-search-grid">
            {results.map((v, idx) => {
              const isWishlisted = wishlistedVideos.has(v.videoId);
              return (
                <div
                  key={v.videoId}
                  className="video-card"
                  title={v.title}
                  tabIndex={0}
                  onClick={() => onPick?.(v)}
                >
                  <div className="video-thumbnail">
                    <img src={v.thumbnail} alt="" />
                    {/* Level overlay: JUNIOR / SENIOR */}
                    {v.level === 'JUNIOR' && (
                      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md text-white bg-[#FF8C00]">JUNIOR</span>
                    )}
                    {v.level === 'SENIOR' && (
                      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md text-white bg-[#6DD5ED]">SENIOR</span>
                    )}
                  
                    <button 
                      type="button" 
                      className={`youtube-search-heart${isWishlisted ? ' active' : ''}`} 
                      tabIndex={-1} 
                      aria-label="Add to Wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(v);
                      }}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? '#ef4444' : 'none'}
                        stroke={isWishlisted ? '#ef4444' : 'currentColor'}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="video-card-content">
                    <div className="text-sm font-semibold line-clamp-2" style={{ color: '#343A40', fontFamily: 'Outfit, Inter, sans-serif' }}>{v.title}</div>
                    <div className="text-xs mt-1" style={{ color: '#6C757D', fontFamily: 'Open Sans, Nunito Sans, sans-serif' }}>{v.channelTitle}</div>
                    {/* Tags */}
                    {v.tags && v.tags.length > 0 && (
                      <div className="mt-2 flex flex-row flex-wrap items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {v.tags.map((t, i) => (
                          <span key={i} className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mr-1 whitespace-nowrap"
                            style={{ backgroundColor: '#E6F4FF', color: '#2196F3', fontFamily: 'Open Sans, Nunito Sans, sans-serif' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(results.length > 0 && (nextPageToken || prevPageToken)) && (
            <div className="youtube-search-pagination">
              <button
                disabled={!prevPageToken || loading}
                onClick={() => fetchPage(prevPageToken)}
                className="youtube-search-pagebtn"
              >Prev</button>
              <button
                disabled={!nextPageToken || loading}
                onClick={() => fetchPage(nextPageToken)}
                className="youtube-search-pagebtn"
              >Next</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
