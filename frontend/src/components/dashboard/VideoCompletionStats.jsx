import React from 'react';

const VideoCompletionStats = ({ 
  video, 
  watchHistory = [], 
  className = "" 
}) => {
  if (!video) return null;

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

  // Find this video in watch history
  const videoHistory = watchHistory.find(v => v.videoId === video.videoId);
  
  const watchedSeconds = videoHistory?.watchedSeconds || 0;
  const totalSeconds = videoHistory?.totalSeconds || video.totalSeconds || 0;
  const progress = totalSeconds > 0 ? Math.round((watchedSeconds / totalSeconds) * 100) : 0;
  
  const getCompletionStatus = () => {
    if (progress >= 90) return { status: 'Completed', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' };
    if (progress >= 50) return { status: 'In Progress', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' };
    if (progress > 0) return { status: 'Started', color: 'text-blue-600', bg: 'bg-blue-50', icon: '▶️' };
    return { status: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-50', icon: '⏸️' };
  };

  const completionStatus = getCompletionStatus();

  // Calculate estimated time to complete
  const remainingSeconds = totalSeconds - watchedSeconds;
  const estimatedTimeLeft = remainingSeconds > 0 ? formatTime(remainingSeconds) : '0:00';

  // Get category
  const getCategory = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('tutorial') || lowerTitle.includes('learn')) return { name: 'Education', icon: '🎓' };
    if (lowerTitle.includes('music') || lowerTitle.includes('song')) return { name: 'Music', icon: '🎵' };
    if (lowerTitle.includes('gaming') || lowerTitle.includes('game')) return { name: 'Gaming', icon: '🎮' };
    if (lowerTitle.includes('tech') || lowerTitle.includes('programming')) return { name: 'Technology', icon: '💻' };
    return { name: 'General', icon: '📺' };
  };

  const category = getCategory(video.title);

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📊</span>
          Video Progress
        </h3>
        <div className={`px-3 py-1 rounded-full ${completionStatus.bg}`}>
          <span className={`text-sm font-medium ${completionStatus.color} flex items-center`}>
            <span className="mr-1">{completionStatus.icon}</span>
            {completionStatus.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Percentage */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800 mb-1">{progress}%</div>
          <div className="text-sm text-gray-600">Complete</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Time Watched */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-800 mb-1">{formatTime(watchedSeconds)}</div>
          <div className="text-sm text-blue-600">Time Watched</div>
        </div>

        {/* Time Remaining */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-800 mb-1">{estimatedTimeLeft}</div>
          <div className="text-sm text-green-600">Time Remaining</div>
        </div>

        {/* Category */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-1">{category.icon}</div>
          <div className="text-sm font-medium text-purple-800">{category.name}</div>
          <div className="text-xs text-purple-600">Category</div>
        </div>
      </div>

      {/* Detailed Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {formatTime(watchedSeconds)} / {formatTime(totalSeconds)}</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Progress indicator dot */}
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-blue-500" />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default VideoCompletionStats;
