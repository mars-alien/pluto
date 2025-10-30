import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing resizable panels with industry-standard behavior
 */
export const useResizablePanels = (initialLeftWidth = 60, minWidth = 30, maxWidth = 70, userId = null) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Start resizing
  const startResizing = useCallback((e) => {
    if (!containerRef.current) return;
    
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = leftWidth;
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    
    e.preventDefault();
    e.stopPropagation();
  }, [leftWidth]);

  // Handle mouse move during resize
  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;
    
    // Use rAF to throttle to screen refresh rate for smoother dragging
    if (handleMouseMove.rafId) cancelAnimationFrame(handleMouseMove.rafId);
    handleMouseMove.rafId = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - startXRef.current;
      const deltaPercent = (deltaX / containerRect.width) * 100;
      
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidthRef.current + deltaPercent)
      );
      setLeftWidth(newWidth);
    });
  }, [isResizing, minWidth, maxWidth]);

  // Stop resizing
  const stopResizing = useCallback(() => {
    if (!isResizing) return;
    
    setIsResizing(false);
    
    // Restore normal cursor and text selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Save to localStorage for persistence (panel settings only)
    localStorage.setItem('dashboard-left-width', leftWidth.toString());
  }, [isResizing, leftWidth]);

  // Handle escape key to cancel resize
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isResizing) {
      setLeftWidth(startWidthRef.current);
      stopResizing();
    }
  }, [isResizing, stopResizing]);

  // Set up event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
      document.addEventListener('keydown', handleKeyDown);
      
      // Handle window blur to stop resizing
      const handleWindowBlur = () => stopResizing();
      window.addEventListener('blur', handleWindowBlur);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [isResizing, handleMouseMove, stopResizing, handleKeyDown]);

  // Load saved width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem('dashboard-left-width');
    if (savedWidth) {
      const parsedWidth = parseFloat(savedWidth);
      if (!isNaN(parsedWidth) && parsedWidth >= minWidth && parsedWidth <= maxWidth) {
        setLeftWidth(parsedWidth);
      }
    }
  }, [minWidth, maxWidth]);

  // Reset to default width
  const resetWidth = useCallback(() => {
    setLeftWidth(initialLeftWidth);
    localStorage.setItem('dashboard-left-width', initialLeftWidth.toString());
  }, [initialLeftWidth]);

  // Get computed styles for panels
  const getLeftPanelStyle = useCallback(() => {
    return {
      width: window.innerWidth >= 1024 ? `${leftWidth}%` : '100%',
      minWidth: window.innerWidth >= 1024 ? `${minWidth}%` : '100%',
      maxWidth: window.innerWidth >= 1024 ? `${maxWidth}%` : '100%'
    };
  }, [leftWidth, minWidth, maxWidth]);

  const getRightPanelStyle = useCallback(() => {
    return {
      width: window.innerWidth >= 1024 ? `${100 - leftWidth}%` : '100%',
      minWidth: window.innerWidth >= 1024 ? `${100 - maxWidth}%` : '100%',
      maxWidth: window.innerWidth >= 1024 ? `${100 - minWidth}%` : '100%'
    };
  }, [leftWidth, minWidth, maxWidth]);

  return {
    // State
    leftWidth,
    isResizing,
    containerRef,
    
    // Actions
    startResizing,
    resetWidth,
    
    // Computed styles
    getLeftPanelStyle,
    getRightPanelStyle,
    
    // Constants
    minWidth,
    maxWidth
  };
};

export default useResizablePanels;
