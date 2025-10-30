import React from 'react';

/**
 * Graphical Stats Component
 * Displays video-related statistics and information with charts
 */
const GraphicalStats = ({ 
  video, 
  watchHistory = [], 
  className = "",
  currentVideoProgress = 0 // Live progress from current video
}) => {
  // Calculate stats with live updates
  const totalVideos = watchHistory.length;
  const totalWatchedTime = watchHistory.reduce((total, video) => 
    total + (video.watchedSeconds || 0), 0
  );
  const completedVideos = watchHistory.filter(video => 
    video.watchedSeconds >= (video.totalSeconds * 0.9)
  ).length;

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const completionRate = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  const recent = watchHistory.slice(0, 12);
  const recentPercents = recent.map(v => {
    const t = v.totalSeconds || 0;
    const w = v.watchedSeconds || 0;
    return t > 0 ? Math.round((w / t) * 100) : 0;
  });

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Your Learning Stats
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total videos - compact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">📺</div>
          <div className="text-lg sm:text-xl font-bold text-gray-800">{totalVideos}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Videos</div>
        </div>

        {/* Total watch time */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl mb-1">⏱️</div>
          <div className="text-lg sm:text-xl font-bold text-gray-800">{formatTime(totalWatchedTime)}</div>
          <div className="text-xs sm:text-sm text-gray-600">Watch Time</div>
        </div>

        {/* Completion rate donut */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 flex items-center justify-center">
          <svg width="72" height="72" viewBox="0 0 36 36" className="mr-3">
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#fde7c7" strokeWidth="3" />
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#fb923c" strokeWidth="3" strokeDasharray={`${completionRate}, 100`} />
            {/* live current video overlay if available */}
            {video && currentVideoProgress > 0 && (
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${Math.min(currentVideoProgress,100)}, 100`} strokeOpacity="0.7" />
            )}
          </svg>
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-800">{completionRate}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>

        {/* Sparkline of recent progress */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
          <div className="text-xs text-gray-600 mb-1">Recent Progress</div>
          <svg width="100%" height="48" viewBox="0 0 120 48">
            <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" points={recentPercents.map((p, i) => `${(i/(Math.max(1,recentPercents.length-1)))*120},${48 - (p/100)*48}`).join(' ')} />
            <line x1="0" y1="47" x2="120" y2="47" stroke="#ddd" strokeWidth="1" />
          </svg>
          <div className="text-[11px] text-gray-500 mt-1">Last {recentPercents.length} videos</div>
        </div>
      </div>

      {/* Current Video Info */}
      {video && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Currently Watching:</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800 truncate">
              {video.title || 'YouTube Video'}
            </p>
            {video.channel && (
              <p className="text-xs text-gray-600 mt-1">
                by {video.channel}
              </p>
            )}
            {currentVideoProgress > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Live progress</span>
                  <span>{currentVideoProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100,currentVideoProgress)}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicalStats;
