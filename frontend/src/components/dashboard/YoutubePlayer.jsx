import React, { useEffect, useState, useRef } from 'react';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';

/**
 * Professional YouTube Player Component
 * With fullscreen support and no video suggestions
 */
const YouTubePlayer = ({ 
  videoId, 
  onTimeUpdate, 
  onVideoEnd,
  className = "",
  style = {},
  options = {}
}) => {
  const {
    playerRef,
    containerRef,
    isReady,
    currentTime,
    duration,
    isPlaying,
    isFullscreen,
    volume,
    isMuted,
    error,
    playbackRate,
    controls
  } = useYouTubePlayer(videoId, options);

  const [localPlaybackRate, setLocalPlaybackRate] = useState(1);

  useEffect(() => {
    if (playbackRate) {
      setLocalPlaybackRate(playbackRate);
    }
  }, [playbackRate]);

  const [showControls, setShowControls] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hideControlsTimeout = useRef(null);

  // Notify parent component of time updates
  useEffect(() => {
    if (onTimeUpdate && currentTime > 0) {
      onTimeUpdate(currentTime, duration);
    }
  }, [currentTime, duration, onTimeUpdate]);

  // Handle video end
  useEffect(() => {
    if (isReady && duration > 0 && currentTime >= duration - 0.5 && currentTime > 0) {
      onVideoEnd?.();
    }
  }, [currentTime, duration, isReady, onVideoEnd]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && isPlaying) {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        if (!isHovering) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [showControls, isPlaying, isHovering]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isReady || !isHovering) return;
      
      const handledKeys = [' ', 'k', 'K', 'j', 'J', 'l', 'L', 'm', 'M', 'f', 'F', 'ArrowLeft', 'ArrowRight', '0', 'Home', 'End'];
      if (!handledKeys.includes(e.key)) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          isPlaying ? controls.pause() : controls.play();
          break;
        case 'ArrowLeft':
          controls.seekTo(Math.max(0, currentTime - 5));
          break;
        case 'ArrowRight':
          controls.seekTo(Math.min(duration, currentTime + 5));
          break;
        case 'j':
        case 'J':
          controls.seekTo(Math.max(0, currentTime - 10));
          break;
        case 'l':
        case 'L':
          controls.seekTo(Math.min(duration, currentTime + 10));
          break;
        case 'm':
        case 'M':
          controls.toggleMute();
          break;
        case 'f':
        case 'F':
          controls.toggleFullscreen();
          break;
        case '0':
        case 'Home':
          controls.seekTo(0);
          break;
        case 'End':
          controls.seekTo(duration);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isReady, isPlaying, currentTime, duration, controls, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (isPlaying) {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  };

  const handleMouseMove = () => {
    if (!showControls) {
      setShowControls(true);
    }
  };

  const handleProgressClick = (e) => {
    if (!isReady || !duration) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = duration * percentage;
    
    controls.seekTo(newTime);
  };

  if (!videoId) {
    return (
      <div>
        <div className={`flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 ${className}`} style={style}>
          <div className="text-center text-gray-300">
            <div className="text-7xl mb-6">🎬</div>
            <p className="text-2xl font-semibold mb-2">No Video Selected</p>
            <p className="text-sm text-gray-400">Please select a video to play</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div 
      ref={containerRef}
      className={`relative bg-black ${className}`} 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* YouTube Player Container */}
      <div 
        ref={playerRef}
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      {/* Video Title & Channel Info */}
      <div className="absolute top-0 left-0 w-full z-20 flex flex-col items-start px-4 pt-4">
        <div className="text-white text-lg font-semibold mt-4 px-1" style={{ fontSize: '18px', fontWeight: 600 }}>{options?.title || ''}</div>
        <div className="text-gray-300 text-sm mt-2 px-1" style={{ fontSize: '14px' }}>{options?.channel || ''}</div>
      </div>
      {/* Overlay to hide YouTube suggestions on pause/end */}
      {isReady && !isPlaying && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-80 pointer-events-none z-10"
          style={{ backdropFilter: 'blur(10px)' }}
        />
      )}
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20 pointer-events-none">
          <div className="text-center text-white">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-red-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <p className="text-lg font-medium">Loading Video...</p>
            <p className="text-sm text-gray-400 mt-1">Please wait</p>
          </div>
        </div>
      )}
      {/* Custom Controls Overlay */}
      {isReady && duration > 0 && (showControls || !isPlaying) && (
        <div 
          className="absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 pointer-events-auto"
          style={{ opacity: showControls || !isPlaying ? 1 : 0 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div 
            className="relative group cursor-pointer" 
            onClick={handleProgressClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-gray-600 bg-opacity-40 group-hover:h-1.5 transition-all">
              <div 
                className="h-full bg-blue-500 transition-all duration-100 pointer-events-none"
                style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
              />
            </div>
          </div>
          {/* Control Bar */}
          <div className="bg-black bg-opacity-40 backdrop-blur-md px-4 py-1 rounded-lg mt-0.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isPlaying ? controls.pause() : controls.play();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white border-none focus:outline-none"
                title={isPlaying ? "Pause (K)" : "Play (K)"}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              {/* Volume Control */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  controls.toggleMute();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-white border-none focus:outline-none"
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume > 50 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                  </svg>
                )}
              </button>
              {/* Fullscreen Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  controls.toggleFullscreen();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-white border-none focus:outline-none"
                title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                )}
              </button>
              {/* Time Display */}
              <span className="text-xs font-mono tabular-nums ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            {/* Playback Speed Selector on right */}
            <div className="flex items-center ">
                  <label htmlFor="playbackRate" className="mr-2 text-xs text-gray-300 flex items-center h-8">Speed</label>
                  <select
                    id="playbackRate"
                    className="px-3 py-2 rounded bg-gray-700 text-white text-xs focus:outline-none border border-gray-600 flex items-center h-8"
                    value={localPlaybackRate}
                    onChange={e => {
                      const rate = Number(e.target.value);
                      setLocalPlaybackRate(rate);
                      controls.setPlaybackRate(rate);
                    }}
                    style={{ minWidth: '56px' }}
                    title="Playback Speed"
                  >
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                    <option value={2.5}>2.5x</option>
                    <option value={3}>3x</option>
                  </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
const formatTime = (seconds) => {
  if (!seconds || seconds === 0 || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default YouTubePlayer;