import React, { useState } from 'react';


const EditorPanel = ({ 
  children, 
  className = "",
  title = "Editor",
  showHeader = true,
  allowMobileToggle = false  
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Mobile (Optional) */}
      {allowMobileToggle && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
          aria-label="Toggle Editor"
        >
          {isMobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          )}
        </button>
      )}

      {/* Editor Panel - Hidden on small devices by default */}
      <div 
        className={`
          ${allowMobileToggle && isMobileOpen ? 'fixed inset-0 z-40 lg:relative' : 'hidden lg:flex'}
          lg:flex
          bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg flex-col 
          ${className}
        `}
      >
        {showHeader && (
          <div className="px-4 py-0 border-b border-gray-200 bg-gray-50 rounded-t-xl flex items-center justify-between">
           
            
            {/* Close button for mobile when toggled open */}
            {allowMobileToggle && isMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Close Editor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 p-4 overflow-auto">
          {children || (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm">Editor panel ready for integration</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditorPanel