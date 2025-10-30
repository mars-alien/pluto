import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useResizablePanels from "../hooks/useResizablePanels";
import DashboardService from "../services/DashboardService";
import ResizablePanelLayout from "../components/layout/ResizablePanelLayout";

import Header from "../components/Header";
import YouTubeSearch from "../components/dashboard/YouTubeSearch";
import ScrollableVideoHistory from "../components/dashboard/ScrollableVideoHistory";
import GraphicalStats from "../components/dashboard/GraphicalStats";
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
      setCurrentVideo(result.video);
      // Refresh watch history
      const updatedHistory = await DashboardService.getWatchHistory(10, 1);
      setWatchHistory(updatedHistory || []);
    } catch (err) {
      setError(err.message || "Failed to load video. Please try again.");
    } finally {
      setIsLoading(false);
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
          console.error('Error updating watch progress:', error);
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

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  {/* Header */}
  <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-full mx-auto px-2 mt-12 sm:px-4 lg:px-6 py-4 sm:py-8">
        {!currentVideo ? (
          // Search Interface
          <div className="max-w-6xl mx-auto space-y-1">

            {/* YouTube Search */}
            <YouTubeSearch onPick={handlePickVideo} />

            {/* Graphical Stats Section */}
            <GraphicalStats 
              watchHistory={watchHistory}
              currentVideoProgress={currentVideoProgress}
              video={currentVideo}
              className="max-w-6xl mx-auto"
            />

            {/* Scrollable Video History */}
            <ScrollableVideoHistory
              watchHistory={watchHistory}
              onLoadFromHistory={handleLoadFromHistory}
              onClearHistory={handleClearHistory}
              calculateProgress={calculateProgress}
              className="max-w-6xl mx-auto"
            />
          </div>
        ) : (
          // Video Player Interface with Resizable Panels
          <ResizablePanelLayout
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
            leftWidth={leftWidth}
            isResizing={isResizing}
            containerRef={containerRef}
            onStartResizing={startResizing}
            onReset={resetWidth}
            leftPanelStyle={getLeftPanelStyle()}
            rightPanelStyle={getRightPanelStyle()}
            className="h-[calc(100vh-200px)]"
          />
        )}
      </main>
    </div>
  );
}
