import React from 'react';

const ScrollableVideoHistory = ({ 
  watchHistory, 
  onLoadFromHistory, 
  onClearHistory, 
  calculateProgress,
  className = ""
}) => {
  if (!watchHistory || watchHistory.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">📺 Watch History</h3>
        <button 
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {watchHistory.map((video) => {
          const progress = calculateProgress(video.watchedSeconds, video.totalSeconds);
          return (
            <div
              key={video.id || video.videoId}
              onClick={() => onLoadFromHistory(video)}
              className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative">
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                  alt={video.title || 'Video'}
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl sm:text-2xl">▶</span>
                  </div>
                </div>
                {video.duration && video.duration !== "Unknown" && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm sm:text-base">
                  {video.title || 'YouTube Video'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  {video.channel || 'Unknown Channel'}
                </p>
                
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableVideoHistory;
