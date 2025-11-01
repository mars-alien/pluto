import React, { useState, useEffect, useRef } from 'react';

/**
 * Professional Resizable Divider Component
 * Similar to Cursor/Claude application dividers
 * 
 * Usage:
 * <div style={{ display: 'flex', height: '100vh' }}>
 *   <div style={{ width: `${leftWidth}px` }}>Left Panel</div>
 *   <ResizableDivider 
 *     onResize={(newWidth) => setLeftWidth(newWidth)} 
 *     minWidth={200}
 *     maxWidth={800}
 *     defaultWidth={400}
 *   />
 *   <div style={{ flex: 1 }}>Right Panel</div>
 * </div>
 */

const ResizableDivider = ({ 
  onResize,
  onStartResizing,
  isResizing: externalIsResizing,
  showTooltip = false,
  thickness = 'medium',
  onDoubleClick,
  minWidth = 200,
  maxWidth = 1000,
  defaultWidth = 400,
  orientation = 'vertical', // 'vertical' or 'horizontal'
  className = ''
}) => {
  const [internalIsResizing, setInternalIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dividerRef = useRef(null);
  const startPosRef = useRef(0);
  const startWidthRef = useRef(defaultWidth);
  
  // Use external isResizing if provided, otherwise use internal state
  const currentIsResizing = externalIsResizing !== undefined ? externalIsResizing : internalIsResizing;

  // Handle mouse down - start resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    
    // Call external onStartResizing if provided, otherwise use internal state
    if (onStartResizing) {
      onStartResizing(e);
    } else {
      setInternalIsResizing(true);
    }
    
    if (orientation === 'vertical') {
      startPosRef.current = e.clientX;
    } else {
      startPosRef.current = e.clientY;
    }
    
    // Get the current width of the left panel
    const leftPanel = dividerRef.current?.previousElementSibling;
    if (leftPanel) {
      startWidthRef.current = leftPanel.offsetWidth;
    }
    
    // Add cursor style to body
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  // Handle mouse move - resize
  const handleMouseMove = (e) => {
    if (!currentIsResizing) return;
    
    const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
    const delta = currentPos - startPosRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
    
    if (onResize) {
      onResize(newWidth);
    }
  };

  // Handle mouse up - stop resizing
  const handleMouseUp = () => {
    if (currentIsResizing) {
      setInternalIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (currentIsResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [currentIsResizing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  const isVertical = orientation === 'vertical';

  return (
    <div
      ref={dividerRef}
      className={`
        relative group
        ${isVertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
        ${currentIsResizing 
          ? 'bg-blue-500' 
          : isHovered
            ? 'bg-gray-400'
            : 'bg-gray-300'
        }
        transition-colors duration-150
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={onDoubleClick}
      style={{
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* Wider invisible hit area for easier grabbing */}
      <div 
        className={`
          absolute 
          ${isVertical 
            ? 'inset-y-0 -left-2 -right-2 w-5 cursor-col-resize' 
            : 'inset-x-0 -top-2 -bottom-2 h-5 cursor-row-resize'
          }
        `}
      />
      
      {/* Visual grip indicator */}
      <div className={`
        absolute 
        ${isVertical 
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12' 
          : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-12'
        }
        rounded-full flex items-center justify-center
        transition-all duration-200
        ${currentIsResizing 
          ? 'bg-blue-500 scale-110' 
          : isHovered
            ? 'bg-gray-500 scale-105'
            : 'bg-transparent'
        }
      `}>
        {/* Grip dots */}
        <div className={`
          flex gap-1
          ${isVertical ? 'flex-col' : 'flex-row'}
          ${(isHovered || currentIsResizing) ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-200
        `}>
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </div>

      {/* Active resize indicator */}
      {currentIsResizing && (
        <div className={`
          absolute 
          ${isVertical 
            ? 'inset-y-0 left-0 w-full' 
            : 'inset-x-0 top-0 h-full'
          }
          bg-blue-500/20
        `} />
      )}
    </div>
  );
};

export default ResizableDivider;