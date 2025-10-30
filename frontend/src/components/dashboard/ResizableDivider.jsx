import React from 'react';

const ResizableDivider = ({ 
  onStartResizing, 
  isResizing = false,
  showTooltip = true,
  thickness = 'medium',
  onDoubleClick
}) => {
  const thicknessMap = {
    thin: 'w-0.5',
    medium: 'w-1',
    thick: 'w-1.5'
  };

  return (
    <div 
      className={`
        hidden lg:block ${thicknessMap[thickness]} relative cursor-col-resize 
        transition-all duration-200 group
        ${isResizing 
          ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
          : 'bg-gray-300 hover:bg-blue-400'
        }
      `}
      onMouseDown={onStartResizing}
      onDoubleClick={onDoubleClick}
      style={{
        userSelect: 'none',
        touchAction: 'none'
      }}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resizable panel divider"
    >
      {/* Invisible wider hit area for easier grabbing */}
      <div 
        className="absolute inset-y-0 -left-3 -right-3 w-6"
        style={{ cursor: 'col-resize' }}
      />
      
      {/* Center grip handle */}
      <div className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-6 h-16 rounded-lg flex flex-col items-center justify-center gap-0.5
        transition-all duration-200 shadow-lg z-10
        ${isResizing 
          ? 'bg-blue-500 scale-110 opacity-100' 
          : 'bg-gray-500 group-hover:bg-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-105'
        }
      `}>
        {/* Grip dots */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/80" />
            <div className="w-1 h-1 rounded-full bg-white/80" />
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/80" />
            <div className="w-1 h-1 rounded-full bg-white/80" />
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/80" />
            <div className="w-1 h-1 rounded-full bg-white/80" />
          </div>
        </div>
      </div>

      {/* Animated glow effect when resizing */}
      {isResizing && (
        <>
          <div className="absolute inset-0 bg-blue-400 animate-pulse opacity-50" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-300 -translate-x-1/2 shadow-sm" />
        </>
      )}

      {/* Tooltip */}
      {showTooltip && !isResizing && (
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md 
          whitespace-nowrap pointer-events-none z-20
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          -translate-y-16 group-hover:-translate-y-20
        `}>
          Drag to resize
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Top gradient fade */}
      <div className={`
        absolute top-0 left-0 right-0 h-32 
        transition-opacity duration-200
        ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none
      `} />

      {/* Bottom gradient fade */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-32 
        transition-opacity duration-200
        ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none
      `} />

      {/* Resize indicator arrows */}
      <div className={`
        absolute top-8 left-1/2 -translate-x-1/2 
        flex items-center gap-1 transition-all duration-200
        ${isResizing 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-75 group-hover:opacity-80 group-hover:scale-90'
        }
      `}>
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
        </svg>
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
        </svg>
      </div>

      {/* Active state pulse indicator */}
      {isResizing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-30" />
      )}
    </div>
  );
};

export default ResizableDivider;