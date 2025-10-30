import React from 'react';
import ResizableDivider from '../dashboard/ResizableDivider';

/**
 * Reusable Resizable Panel Layout Component
 * Can be used for any two-panel layout with resizing capability
 */
const ResizablePanelLayout = ({
  leftPanel,
  rightPanel,
  leftWidth,
  isResizing,
  containerRef,
  onStartResizing,
  onReset,
  leftPanelStyle,
  rightPanelStyle,
  className = ""
}) => {
  return (
    <div
      ref={containerRef}
      className={`flex h-full min-h-[600px] ${className}`}
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      {/* Left Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={leftPanelStyle}
      >
        {leftPanel}
      </div>

      {/* Resizable Divider */}
      <ResizableDivider 
        onStartResizing={onStartResizing} 
        isResizing={isResizing}
        showTooltip={true}
        thickness="medium"
        onDoubleClick={onReset}
      />

      {/* Right Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={rightPanelStyle}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanelLayout;
