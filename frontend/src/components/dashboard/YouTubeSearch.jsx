import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';

export default function YouTubeSearch({ onPick, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchPage = async (pageToken = '') => {
    const query = q.trim();
    if (!query) {
      setResults([]); setNextPageToken(null); setPrevPageToken(null); setErr('');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const data = await DashboardService.searchYouTube(query, { pageToken, maxResults: 24 });
      setResults(data.items || []);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
    } catch (e) {
      setErr(e.message || 'Search failed');
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
              className="w-full px-4 py-3 pr-10 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => fetchPage('')}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map(v => (
            <button
              key={v.videoId}
              onClick={() => onPick?.(v)}
              className="text-left border border-gray-200 rounded-lg p-2 hover:shadow-md bg-white"
              title={v.title}
            >
              <img src={v.thumbnail} alt="" className="w-full rounded-md" />
              <div className="mt-2 text-sm font-semibold line-clamp-2">{v.title}</div>
              <div className="text-xs text-gray-500">{v.channelTitle}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={!prevPageToken || loading}
            onClick={() => fetchPage(prevPageToken)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl   disabled:opacity-50"
          >Prev</button>
          <button
            disabled={!nextPageToken || loading}
            onClick={() => fetchPage(nextPageToken)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl  disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  );
}