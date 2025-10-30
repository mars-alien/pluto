import React from 'react';

/**
 * Scrollable Video History Component
 * Industry-standard scrollable video list with infinite scroll capability
 */
const ScrollableVideoHistory = ({ 
  watchHistory, 
  onLoadFromHistory, 
  onClearHistory, 
  calculateProgress,
  className = ""
}) => {
  if (!watchHistory || watchHistory.length === 0) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-6 ${className}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📺</span>
          Watch History
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p>No videos watched yet</p>
          <p className="text-sm">Start watching to build your history</p>
        </div>
      </div>
    );
  }

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

  const getCategoryIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('tutorial') || lowerTitle.includes('learn')) {
      return { icon: '🎓', category: 'Education', color: 'bg-blue-100 text-blue-800' };
    } else if (lowerTitle.includes('music') || lowerTitle.includes('song')) {
      return { icon: '🎵', category: 'Music', color: 'bg-purple-100 text-purple-800' };
    } else if (lowerTitle.includes('gaming') || lowerTitle.includes('game')) {
      return { icon: '🎮', category: 'Gaming', color: 'bg-green-100 text-green-800' };
    } else if (lowerTitle.includes('tech') || lowerTitle.includes('programming')) {
      return { icon: '💻', category: 'Technology', color: 'bg-gray-100 text-gray-800' };
    } else {
      return { icon: '📺', category: 'General', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getCompletionStatus = (watchedSeconds, totalSeconds) => {
    const progress = calculateProgress(watchedSeconds, totalSeconds);
    if (progress >= 90) {
      return { status: 'Completed', color: 'bg-green-100 text-green-800', icon: '✅' };
    } else if (progress >= 50) {
      return { status: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
    } else {
      return { status: 'Just Started', color: 'bg-red-100 text-red-800', icon: '▶️' };
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg ${className}`}>
      {/* Header with Clear Button */}
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📺</span>
            Watch History
            <span className="ml-2 text-sm font-normal text-gray-500">({watchHistory.length})</span>
          </h3>
          <button 
            onClick={onClearHistory}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-200 hover:border-red-300"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Scrollable Video List - use available viewport height while in search view */}
      <div className="max-h-[60vh] lg:max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="p-6 space-y-4">
          {watchHistory.map((video, index) => {
            const progress = calculateProgress(video.watchedSeconds, video.totalSeconds);
            const category = getCategoryIcon(video.title);
            const completionStatus = getCompletionStatus(video.watchedSeconds, video.totalSeconds);
            
            return (
              <div
                key={video.id || video._id}
                onClick={() => onLoadFromHistory(video)}
                className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-all border border-transparent hover:border-gray-200 hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  {/* Video Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                      alt={video.title || 'Video'}
                      className="w-24 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
                      }}
                    />
                    
                    {/* Progress Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 rounded-b-lg">
                      <div className="text-xs text-center">{progress}%</div>
                      <div className="w-full bg-gray-600 rounded-full h-0.5">
                        <div
                          className="bg-red-500 h-0.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                          {video.title || 'YouTube Video'}
                        </h4>
                        
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {video.channel || 'Unknown Channel'}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                            {category.icon} {category.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${completionStatus.color}`}>
                            {completionStatus.icon} {completionStatus.status}
                          </span>
                        </div>

                        {/* Time Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>⏱️ {formatTime(video.watchedSeconds || 0)} / {formatTime(video.totalSeconds || 0)}</span>
                          <span>📊 {progress}% complete</span>
                        </div>
                      </div>

                      {/* Video ID */}
                      {/* <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-xs text-gray-400 font-mono">
                          {video.videoId}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="text-center text-xs text-gray-500">
          Scroll to see more videos • Click any video to continue watching
        </div>
      </div>
    </div>
  );
};

export default ScrollableVideoHistory;
