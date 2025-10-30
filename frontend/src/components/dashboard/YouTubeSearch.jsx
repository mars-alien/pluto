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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-8 mb-6 sm:mb-8 border border-white/20 shadow-lg">
      
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search YouTube…"
              className="w-full px-3.5 py-2 pr-5 text-sm sm:text-base bg-white border rounded-xl placeholder-[#6C757D] outline-none transition-all"
              style={{ borderColor: '#E9ECEF' }}
            />
          </div>
          <button
            onClick={() => fetchPage('')}
            disabled={loading}
            className="px-3.5 py- bg-[#6DD5ED] text-white rounded-lg hover:bg-[#57C3D9] transition-colors font-semibold"
            style={{ fontFamily: 'Outfit, Inter, sans-serif' }}
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map(v => (
            <button
              key={v.videoId}
              onClick={() => onPick?.(v)}
              className="relative text-left border border-gray-200 rounded-lg p-2 hover:shadow-md bg-white hover:border-[#2196F3] transition-colors"
              title={v.title}
            >
              <div className="relative">
                <img src={v.thumbnail} alt="" className="w-full rounded-md" />

                {/* Level overlay: JUNIOR / SENIOR */}
                {v.level === 'JUNIOR' && (
                  <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md text-white bg-[#FF8C00]">JUNIOR</span>
                )}
                {v.level === 'SENIOR' && (
                  <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md text-white bg-[#6DD5ED]">SENIOR</span>
                )}

                {/* Heart / favorite icon (non-interactive) */}
                <span className="absolute top-2 right-2">
                  <svg
                    className={`w-5 h-5 ${v.favorited ? 'text-[#DC3545]' : 'text-[#6C757D]'}`}
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
                </span>
              </div>

              <div className="mt-2 text-sm font-semibold line-clamp-2" style={{ color: '#343A40', fontFamily: 'Outfit, Inter, sans-serif' }}>{v.title}</div>
              <div className="text-xs mt-1" style={{ color: '#6C757D', fontFamily: 'Open Sans, Nunito Sans, sans-serif' }}>{v.channelTitle}</div>

              {/* Tags */}
              {v.tags && v.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {v.tags.map((t, i) => (
                    <span key={i} className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mr-1"
                      style={{ backgroundColor: '#E6F4FF', color: '#2196F3', fontFamily: 'Open Sans, Nunito Sans, sans-serif' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {(results.length > 0 && (nextPageToken || prevPageToken)) && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={!prevPageToken || loading}
              onClick={() => fetchPage(prevPageToken)}
              className="px-3.5 py-2 border-2 border-[#6C757D] rounded-xl bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >Prev</button>
            <button
              disabled={!nextPageToken || loading}
              onClick={() => fetchPage(nextPageToken)}
              className="px-3.5 py-2 border-2 border-[#6C757D] rounded-xl bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        )}
      </div>
    </div>
  );
}