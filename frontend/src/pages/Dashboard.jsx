import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useResizablePanels from "../hooks/useResizablePanels";
import DashboardService from "../services/DashboardService";
import WishlistService from "../services/WishlistService";
import PageLayout from "../components/PageLayout";

import YouTubeSearch from "../components/dashboard/YouTubeSearch";
import VideoPlayerPanel from "../components/dashboard/VideoPlayerPanel";

import { FileProvider } from "../context/FileContext";
import { EditorSettingsProvider } from "../context/EditorSettingsContext";

import EditorPanel from "../components/dashboard/EditorPanel";
import FileTabs from "../components/editor/fileTabs";
import FileTree from "../components/editor/fileTree";

import MonacoEditor from "../components/editor/monacoEditor";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Core State
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState("");
  const [watchHistory, setWatchHistory] = useState([]);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0); // Live progress tracking
  const lastProgressSyncRef = useRef({ ts: 0, pct: 0 });
  const [showEditorSettings, setShowEditorSettings] = useState(false);
  
  // Resizable panels (60% video, 40% editor by default)
  const {
    leftWidth,
    isResizing,
    containerRef,
    startResizing,
    resetWidth,
    getLeftPanelStyle,
    getRightPanelStyle
  } = useResizablePanels(60, 30, 70);

  // Load user's watch history from MongoDB
  useEffect(() => {
    const loadWatchHistory = async () => {
      if (user?.id) {
        try {
          const history = await DashboardService.getWatchHistory(10, 1);
          setWatchHistory(history || []);
        } catch (error) {
          console.error('Error loading watch history:', error);
          setWatchHistory([]);
        }
      } else {
        setWatchHistory([]);
      }
    };

    loadWatchHistory();
  }, [user?.id]);

  // Event Handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const handlePickVideo = useCallback(async (video) => {
    setError("");
    setIsLoading(true);
    try {
      const url = `https://www.youtube.com/watch?v=${video.videoId}`;
      const result = await DashboardService.loadVideo(url);
      
      // Navigate to editor with video
      navigate(`/dashboard/editor/${video.videoId}`, { 
        state: { 
          video: result.video,
          url: url
        } 
      });
    } catch (err) {
      setError(err.message || "Failed to load video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleAddToWishlist = useCallback(async (video) => {
    try {
      await WishlistService.addToWishlist(video);
      // Show success message or update UI
      console.log('Video added to wishlist successfully');
    } catch (err) {
      console.error('Failed to add video to wishlist:', err);
      setError(err.message || "Failed to add video to wishlist.");
    }
  }, []);

  const handleLoadFromHistory = useCallback(async (video) => {
    // Set video with resume position
    const videoWithResumePosition = {
      ...video,
      resumeAt: video.watchedSeconds || 0 // Resume from where left off
    };
    setCurrentVideo(videoWithResumePosition);

    // Update last watched time in MongoDB
    try {
      await DashboardService.updateWatchProgress(
        video.videoId, 
        video.watchedSeconds || 0, 
        video.totalSeconds
      );
      
      // Refresh watch history
      const updatedHistory = await DashboardService.getWatchHistory(10, 1);
      setWatchHistory(updatedHistory || []);
    } catch (error) {
      console.error('Error updating watch progress:', error);
    }
  }, []);

  const handleClearHistory = useCallback(async () => {
    if (window.confirm('Clear all watch history?')) {
      try {
        await DashboardService.clearWatchHistory();
        setWatchHistory([]);
      } catch (error) {
        console.error('Error clearing watch history:', error);
        setError('Failed to clear watch history');
      }
    }
  }, []);

  // YouTube Player event handlers
  const handleTimeUpdate = useCallback(async (currentTime, duration) => {
    if (currentVideo?.videoId) {
      // Update live progress for stats
      const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
      setCurrentVideoProgress(progress);
      
      // Throttle server sync: send every 5s or when progress jumps by >= 5%
      const now = Date.now();
      const last = lastProgressSyncRef.current;
      const shouldSync = (now - last.ts > 5000) || (Math.abs(progress - last.pct) >= 5) || progress >= 99;
      if (shouldSync) {
        lastProgressSyncRef.current = { ts: now, pct: progress };
        try {
          await DashboardService.updateWatchProgress(
            currentVideo.videoId,
            Math.floor(currentTime),
            Math.floor(duration)
          );
        } catch (error) {
          console.error('Dashboard: Error updating watch progress:', error);
        }
      }
    }
  }, [currentVideo?.videoId]);

  const handleVideoEnd = useCallback(async () => {
    if (currentVideo?.videoId) {
      try {
        await DashboardService.updateWatchProgress(
          currentVideo.videoId, 
          currentVideo.totalSeconds || 0, 
          currentVideo.totalSeconds || 0
        );
        
        // Refresh watch history
        const updatedHistory = await DashboardService.getWatchHistory(10, 1);
        setWatchHistory(updatedHistory || []);
      } catch (error) {
        console.error('Error updating video completion:', error);
      }
    }
  }, [currentVideo]);

  // Calculate progress percentage
  const calculateProgress = useCallback((watchedSeconds, totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return 0;
    return Math.round((watchedSeconds / totalSeconds) * 100);
  }, []);

  if (!currentVideo) {
    return (
      <PageLayout 
        onLogout={handleLogout} 
        className="min-h-screen relative overflow-hidden"
        headerRight={
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/dashboard/progress')}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
            title="Learning Performance"
          >
            Performance
          </button>
          <button
            onClick={() => navigate('/dashboard/wishlist')}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
            title="Wishlist & History"
          >
            Wishlist
          </button>
        </div>
      }>
        {/* Mesh Gradient Background - Same as Home Page */}
        <div className="absolute inset-0 overflow-hidden bg-white">
          {/* Top left area */}
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob"
               style={{background: 'linear-gradient(96deg, rgba(254, 245, 113, 0.5) 0%, rgba(174, 255, 168, 0.5) 29.94%, rgba(143, 255, 206, 0.5) 66.98%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
          
          {/* Top right area */}
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
               style={{background: 'linear-gradient(120deg, rgba(254, 245, 113, 0.5) 0%, rgba(143, 255, 206, 0.5) 51.33%, rgba(153, 247, 255, 0.5) 87.79%)'}}></div>
          
          {/* Center left */}
          <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000"
               style={{background: 'linear-gradient(96deg, rgba(174, 255, 168, 0.5) 0%, rgba(143, 255, 206, 0.5) 50%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
          
          {/* Center right */}
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000"
               style={{background: 'linear-gradient(140deg, rgba(143, 255, 206, 0.5) 28.41%, rgba(153, 247, 255, 0.5) 69.04%)'}}></div>
          
          {/* Bottom left */}
          <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
               style={{background: 'linear-gradient(96deg, rgba(143, 255, 206, 0.5) 28.41%, rgba(153, 247, 255, 0.5) 69.04%)'}}></div>
          
          {/* Bottom right */}
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000"
               style={{background: 'linear-gradient(180deg, rgba(174, 255, 168, 0.5) 0%, rgba(143, 255, 206, 0.5) 50%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
          
          {/* Center top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"
               style={{background: 'linear-gradient(220deg, rgba(254, 245, 113, 0.45) 0%, rgba(143, 255, 206, 0.45) 51.33%, rgba(153, 247, 255, 0.45) 87.79%)'}}></div>
          
          {/* Center bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-7000"
               style={{background: 'linear-gradient(60deg, rgba(143, 255, 206, 0.45) 28.41%, rgba(153, 247, 255, 0.45) 69.04%)'}}></div>
          
          {/* Center orb for blending */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-500"
               style={{background: 'linear-gradient(96deg, rgba(174, 255, 168, 0.4) 0%, rgba(143, 255, 206, 0.4) 50%, rgba(153, 247, 255, 0.4) 100%)'}}></div>
        </div>

        <div className="relative z-10 w-full px-4 mt-6">
          <div className="w-full max-w-7xl mx-auto">
            <YouTubeSearch onPick={handlePickVideo} onAddToWishlist={handleAddToWishlist} />
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, -50px) scale(1.1);
            }
            50% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            75% {
              transform: translate(50px, 50px) scale(1.05);
            }
          }
          
          .animate-blob {
            animation: blob 15s infinite;
          }
          
          .animation-delay-500 {
            animation-delay: 0.5s;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-3000 {
            animation-delay: 3s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .animation-delay-5000 {
            animation-delay: 5s;
          }
          
          .animation-delay-6000 {
            animation-delay: 6s;
          }
          
          .animation-delay-7000 {
            animation-delay: 7s;
          }
        `}</style>
      </PageLayout>
    );
  }

  // Split view when a video is open
  return (
    <PageLayout
      onLogout={handleLogout}
      headerRight={
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/dashboard/progress')}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
            title="Learning Performance"
          >
            Performance
          </button>
          <button
            onClick={() => navigate('/dashboard/wishlist')}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
            title="Wishlist & History"
          >
            Wishlist
          </button>
        </div>
      }
      leftPanel={
        <VideoPlayerPanel
          video={currentVideo}
          onClose={() => setCurrentVideo(null)}
          onTimeUpdate={handleTimeUpdate}
          onVideoEnd={handleVideoEnd}
          watchHistory={watchHistory}
          className="h-full"
        />
      }
      rightPanel={
        <EditorPanel title="Code Editor" className="h-full">
          <FileProvider>
            <EditorSettingsProvider>
              <div className="flex h-full">
                <div className="w-64 border-r bg-gray-900 border-gray-800 h-full">
                  <FileTree />
                </div>
                <div className="flex-1 flex flex-col h-full">
                  <FileTabs />
                  <div className="flex-1 min-h-0">
                    <MonacoEditor />
                  </div>
                </div>
              </div>
            </EditorSettingsProvider>
          </FileProvider>
        </EditorPanel>
      }
      containerRef={containerRef}
      isResizing={isResizing}
      onStartResizing={startResizing}
      onReset={resetWidth}
      leftPanelStyle={getLeftPanelStyle()}
      rightPanelStyle={getRightPanelStyle()}
    />
  );
}
