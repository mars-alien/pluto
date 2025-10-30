import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ showBackButton = false, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 -ml-1 sm:ml-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg sm:text-xl">T</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                Tattva
              </span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {showBackButton && (
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white/80 hover:bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </button>
            )}
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">
                  <svg
                    className="w-3.5 h-3.5 sm:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7"
                    />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}