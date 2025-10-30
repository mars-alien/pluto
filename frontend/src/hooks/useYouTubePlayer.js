import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for YouTube IFrame Player API integration
 * Follows industry standards with proper error handling and state management
 */
export const useYouTubePlayer = (videoId, options = {}) => {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolumeState] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [error, setError] = useState(null);

  // Initialize YouTube player
  const initializePlayer = useCallback(() => {
    if (!playerRef.current || !videoId || !window.YT) return;

    try {
      // Destroy existing player if any
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          // Ignore errors during destruction
        }
        playerInstanceRef.current = null;
      }

      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: options.autoplay || 0,
          controls: 1,                    // Show native YouTube controls
          modestbranding: 1,              // Minimal branding
          rel: 0,                         // Don't show related videos from other channels
          showinfo: 0,                    
          iv_load_policy: 3,              // Hide annotations
          fs: 1,                          // Enable fullscreen button
          playsinline: 1,                 // Play inline on iOS
          enablejsapi: 1,
          disablekb: 0,                   // Enable keyboard controls
          origin: window.location.origin,
          ...options.playerVars
        },
        events: {
          onReady: (event) => {
            playerInstanceRef.current = event.target;
            setPlayer(event.target);
            setIsReady(true);
            
            try {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
              }
              setVolumeState(event.target.getVolume() || 100);
              setIsMuted(event.target.isMuted() || false);
            } catch (e) {
              console.error('Error getting player info:', e);
            }
            
            setError(null);
          },
          onStateChange: (event) => {
            const playerState = event.data;
            
            // Update playing state
            setIsPlaying(playerState === window.YT.PlayerState.PLAYING);
            
            // Update duration when available
            try {
              if (playerState === window.YT.PlayerState.PLAYING || 
                  playerState === window.YT.PlayerState.PAUSED ||
                  playerState === window.YT.PlayerState.BUFFERING) {
                const dur = event.target.getDuration();
                if (dur && dur > 0) {
                  setDuration(dur);
                }
              }
            } catch (e) {
              // Ignore errors
            }
          },
          onError: (event) => {
            const errorMessages = {
              2: 'Invalid video ID',
              5: 'HTML5 player error',
              100: 'Video not found or private',
              101: 'Video cannot be embedded',
              150: 'Video cannot be embedded'
            };
            setError(errorMessages[event.data] || 'Unknown error occurred');
            console.error('YouTube Player Error:', event.data);
          }
        }
      });
    } catch (err) {
      console.error('Error initializing YouTube player:', err);
      setError('Failed to initialize player');
    }
  }, [videoId, options.autoplay, options.playerVars]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else if (!window.YT) {
      // Load the IFrame API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Cleanup on unmount or videoId change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (err) {
          // Ignore cleanup errors
        }
        playerInstanceRef.current = null;
      }
    };
  }, [videoId, initializePlayer]);

  // Update current time periodically
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (player && isReady) {
      intervalRef.current = setInterval(() => {
        try {
          if (playerInstanceRef.current && typeof playerInstanceRef.current.getCurrentTime === 'function') {
            const time = playerInstanceRef.current.getCurrentTime();
            if (time !== undefined && time !== null && !isNaN(time)) {
              setCurrentTime(time);
            }
          }
        } catch (err) {
          // Silently ignore - player might be transitioning states
        }
      }, 250); // Update every 250ms for smooth progress
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [player, isReady]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Player control functions with error handling
  const play = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.playVideo === 'function') {
        playerInstanceRef.current.playVideo();
      }
    } catch (err) {
      console.error('Error playing video:', err);
    }
  }, []);

  const pause = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.pauseVideo === 'function') {
        playerInstanceRef.current.pauseVideo();
      }
    } catch (err) {
      console.error('Error pausing video:', err);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.stopVideo === 'function') {
        playerInstanceRef.current.stopVideo();
        setCurrentTime(0);
      }
    } catch (err) {
      console.error('Error stopping video:', err);
    }
  }, []);

  const seekTo = useCallback((seconds) => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.seekTo === 'function') {
        playerInstanceRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
      }
    } catch (err) {
      console.error('Error seeking:', err);
    }
  }, []);

  const setVolume = useCallback((vol) => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.setVolume === 'function') {
        const clampedVolume = Math.max(0, Math.min(100, vol));
        playerInstanceRef.current.setVolume(clampedVolume);
        setVolumeState(clampedVolume);
        if (clampedVolume > 0 && isMuted) {
          playerInstanceRef.current.unMute();
          setIsMuted(false);
        }
      }
    } catch (err) {
      console.error('Error setting volume:', err);
    }
  }, [isMuted]);

  const mute = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.mute === 'function') {
        playerInstanceRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.error('Error muting:', err);
    }
  }, []);

  const unMute = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.unMute === 'function') {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
      }
    } catch (err) {
      console.error('Error unmuting:', err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      unMute();
    } else {
      mute();
    }
  }, [isMuted, mute, unMute]);

  const setPlaybackRate = useCallback((rate) => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.setPlaybackRate === 'function') {
        playerInstanceRef.current.setPlaybackRate(rate);
        setPlaybackRateState(rate);
      }
    } catch (err) {
      console.error('Error setting playback rate:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      if (!isFullscreen) {
        // Enter fullscreen
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, [isFullscreen]);

  const getPlayerState = useCallback(() => {
    try {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.getPlayerState === 'function') {
        return playerInstanceRef.current.getPlayerState();
      }
      return -1;
    } catch (err) {
      console.error('Error getting player state:', err);
      return -1;
    }
  }, []);

  return {
    playerRef,
    containerRef,
    player,
    isReady,
    currentTime,
    duration,
    isPlaying,
    isFullscreen,
    volume,
    isMuted,
    playbackRate,
    error,
    controls: {
      play,
      pause,
      stop,
      seekTo,
      setVolume,
      mute,
      unMute,
      toggleMute,
      setPlaybackRate,
      toggleFullscreen,
      getPlayerState
    }
  };
};