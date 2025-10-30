import React from 'react';
import YouTubePlayer from './YoutubePlayer';
import VideoCompletionStats from './VideoCompletionStats';

/**
 * Enhanced Video Player Panel with custom controls and stats
 */
const VideoPlayerPanel = ({ 
  video, 
  onClose,
  onTimeUpdate,
  onVideoEnd,
  watchHistory = [],
  className = ""
}) => {
  if (!video) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🎥</div>
          <p className="text-xl">No video selected</p>
        </div>
      </div>
    );
  }

  // Calculate progress for custom controls
  const videoHistory = watchHistory.find(v => v.videoId === video.videoId);
  const watchedSeconds = videoHistory?.watchedSeconds || 0;
  const totalSeconds = videoHistory?.totalSeconds || video.totalSeconds || 0;
  const progress = totalSeconds > 0 ? Math.round((watchedSeconds / totalSeconds) * 100) : 0;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg flex flex-col ${className}`}>
      {/* Video Player */}
      <div className="flex-1 relative min-h-[400px]">
        <YouTubePlayer
          videoId={video.videoId}
          onTimeUpdate={onTimeUpdate}
          onVideoEnd={onVideoEnd}
          className="w-full h-full rounded-t-xl"
          options={{ startTime: video.resumeAt || 0 }}
        />
      </div>
      
      {/* Video Completion Stats */}
      <VideoCompletionStats
        video={video}
        watchHistory={watchHistory}
        className="border-t border-gray-200"
      />
      
      {/* Video Info with Close Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {video.title || 'YouTube Video'}
            </h2>
            {video.channel && (
              <p className="text-sm text-gray-600 truncate">{video.channel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all flex-shrink-0"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPanel;
