import React from 'react';
import YouTubePlayer from './YoutubePlayer';

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
  <div className={`bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg flex flex-col ${className}`} style={{ position: 'relative', pointerEvents: 'auto' }}>
      {/* Close Button overlays video area */}
      <button
        onClick={onClose}
        type="button"
        aria-label="Close Video"
        className="absolute top-4 right-4 bg-white/90 text-[#1A1D29] w-9 h-9 rounded-full border-none text-xl font-bold cursor-pointer shadow-lg z-30 transition-all flex items-center justify-center hover:bg-white hover:scale-110"
        style={{ fontWeight: 600, pointerEvents: 'auto' }}
      >
        &#10005;
      </button>
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
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPanel;
