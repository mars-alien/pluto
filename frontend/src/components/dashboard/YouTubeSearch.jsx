import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';

export default function YouTubeSearch({ onPick, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [disclaimer, setDisclaimer] = useState('');

  const fetchPage = async (pageToken = '') => {
    const query = q.trim();
    if (!query) {
      setResults([]); setNextPageToken(null); setPrevPageToken(null); setErr(''); setDisclaimer('');
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

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => { fetchPage(''); }, 350);
    return () => clearTimeout(id);
  }, [q]);

  return (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl px-2 py-3 sm:px-6 sm:py-5 mb-2 sm:mb-8 border border-white/20 shadow-lg w-full flex justify-center">
    <div className="space-y-1 w-full max-w-3xl">
      <form className="flex flex-col sm:flex-row items-center w-full gap-2 sm:gap-4" onSubmit={e => {e.preventDefault(); fetchPage('');}}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search YouTube…"
          className="flex-1 min-w-0 max-w-xl px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base text-gray-700 placeholder-gray-400 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium text-base transition-all duration-200 hover:bg-blue-600 disabled:opacity-60"
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
          {results.map((v, idx) => (
            <div
              key={v.videoId}
              className={`video-card${v.favorited ? ' active' : ''}`}
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
              
                <button type="button" className={`youtube-search-heart${v.favorited ? ' active' : ''}`} tabIndex={-1} aria-label="Favorite">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill={v.favorited ? 'currentColor' : 'none'}
                    stroke="currentColor"
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
          ))}
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
      <style>{`
        .youtube-search-input {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 16px;
          width: 100%;
          max-width: 800px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .youtube-search-input:focus {
          border-color: #4A9EE0;
          box-shadow: 0 0 0 3px rgba(74, 158, 224, 0.1);
          outline: none;
        }
        .youtube-search-btn {
          background: #4A9EE0;
          color: #FFFFFF;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-family: 'Outfit', 'Inter', sans-serif;
          border: none;
          transition: background 0.18s;
        }
        .youtube-search-btn:hover:not(:disabled) {
          background: #3A8ED0;
        }
        .youtube-search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding: 32px;
        }
        /* Glowing Animated Border Effect */
        .video-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: visible;
          border: 1px solid #E2E8F0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .video-card::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 16px;
          background: linear-gradient(45deg, #4A9EE0, #50E3C2, #FF6B7A, #FFB84D, #9F7AEA, #4A9EE0);
          background-size: 300% 300%;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s ease;
          animation: gradient-rotate 3s linear infinite;
        }
        .video-card:hover::before {
          opacity: 1;
        }
        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 0 40px rgba(74,158,224,0.2);
          border-color: transparent;
        }
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .video-thumbnail {
          position: relative;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
        }
        .video-thumbnail img {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-card:hover .video-thumbnail img {
          transform: scale(1.1);
        }
        .video-card-content {
          padding: 16px;
          position: relative;
          z-index: 1;
          background: #FFFFFF;
          border-radius: 0 0 16px 16px;
        }
        /* Heart icon and other styles ...existing code... */
        .youtube-search-heart {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          color: #718096;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 2;
        }
        .youtube-search-heart:hover {
          background: #FFFFFF;
          color: #FF6B7A;
          transform: scale(1.1);
        }
        .youtube-search-heart.active {
          color: #FF6B7A;
        }
        .youtube-search-pagination {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
        }
        .youtube-search-pagebtn {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          color: #718096;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .youtube-search-pagebtn:hover:not(:disabled) {
          border-color: #4A9EE0;
          color: #4A9EE0;
          background: #E8F4FB;
        }
        .youtube-search-pagebtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .youtube-search-btn {
            width: 100%;
            margin-left: 0 !important;
            margin-top: 10px;
          }
          .youtube-search-grid {
            padding: 12px;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}