import React, { useRef, useEffect } from 'react';
import { useFileSystem } from '../../context/FileContext';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    js: '📜',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    json: '📋',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    md: '📝',
    py: '🐍',
    java: '☕',
    cpp: '⚙️',
    go: '🔵',
    rs: '🦀',
    txt: '📄'
  };
  return iconMap[ext] || '📄';
};

export default function FileTabs() {
  const { openFiles, activeFileId, setActiveFileId, closeFile } = useFileSystem();
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    if (tabsContainerRef.current && activeFileId) {
      const activeTab = tabsContainerRef.current.querySelector(`[data-file-id="${activeFileId}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeFileId]);

  const handleWheel = (e) => {
    if (tabsContainerRef.current) {
      e.preventDefault();
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 border-b border-gray-700 overflow-hidden">
      <div
        ref={tabsContainerRef}
        className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        onWheel={handleWheel}
        style={{ scrollbarWidth: 'thin' }}
      >
        {openFiles.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              data-file-id={file.id}
              className={`
                flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer
                min-w-[120px] max-w-[200px] group relative
                ${isActive
                  ? 'bg-gray-800 text-white border-t-2 border-t-blue-500'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }
              `}
              onClick={() => setActiveFileId(file.id)}
            >
              <span className="text-sm flex-shrink-0">{getFileIcon(file.name)}</span>
              <span className="text-xs truncate flex-1" title={file.name}>
                {file.name}
              </span>
              <button
                className={`
                  flex-shrink-0 w-4 h-4 rounded hover:bg-gray-700 flex items-center justify-center
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                title="Close"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
