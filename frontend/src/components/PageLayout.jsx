import React from 'react';
import Navbar from './Navbar';
import ResizableDivider from './dashboard/ResizableDivider';

export default function PageLayout({ 
  children, 
  showBackButton = false, 
  backTo = '/',
  onLogout,
  onLogoClick,
  className = "min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden",
  headerRight = null,

  // Optional resizable two-panel layout (when provided, renders inside main)
  leftPanel = null,
  rightPanel = null,
  containerRef = null,
  isResizing = false,
  onStartResizing = () => {},
  onReset = undefined,
  leftPanelStyle = undefined,
  rightPanelStyle = undefined,
}) {
  const hasResizablePanels = !!(leftPanel || rightPanel);
  const hasCustomBackground = !className.includes('bg-gradient-to-br');

  return (
    <div className={`${className} min-h-screen`}>
      {!hasCustomBackground && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-orange-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      <Navbar showBackButton={showBackButton} backTo={backTo} onLogout={onLogout} onLogoClick={onLogoClick} right={headerRight} />

      <main 
        className="relative z-10 min-h-screen py-4 sm:py-6 lg:py-8" 
        style={hasResizablePanels ? { padding: '100px 0 8px 0' } : { paddingTop: '100px' }}
      >
        {hasResizablePanels ? (
          <div
            ref={containerRef}
            className="flex lg:flex-row h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] min-h-[400px] sm:min-h-[600px] w-full"
            style={{ userSelect: isResizing ? 'none' : 'auto' }}
          >
            {/* Mobile: Show only video player (full screen), Desktop: Side by side */}
            <div className="flex-shrink-0 overflow-hidden h-full w-full lg:w-auto" style={leftPanelStyle}>
              {leftPanel}
            </div>
            <ResizableDivider
              onStartResizing={onStartResizing}
              isResizing={isResizing}
              showTooltip={true}
              thickness="medium"
              onDoubleClick={onReset}
              className="hidden lg:block"
            />
            <div className="hidden lg:block overflow-hidden h-full" style={rightPanelStyle}>
              {rightPanel}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center px-2 sm:px-4">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}