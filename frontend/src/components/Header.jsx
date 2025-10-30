import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../asset/Logo.png';

export default function Header({ showBackButton = false, onLogout, user, right }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#6DD5ED] to-[#2196F3] bg-opacity-95 backdrop-blur-lg border-b border-transparent shadow-sm text-white">
      {/* leftmost logo - absolute so it sits at the screen edge */}
      <div className="absolute left-3 ml-5  sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 flex items-center">
        <img src={Logo} alt="Pluto logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md mr-3" />
        <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-white">Pluto</span>
      </div>

      {/* centered container for any center content (keeps page width aligned) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14 sm:h-16">
          {/* intentionally left centered area empty so main content remains centered */}
          <div />
        </div>
      </div>

      {/* rightmost action area - absolute so it sits at the screen edge */}
      <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 sm:space-x-3">
        {showBackButton && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center mr-5 px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
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

        {right}

        {onLogout && (
          <button
            onClick={onLogout}
            className="inline-flex items-center px-2.5 py-1.5 mr-5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#DC3545] hover:bg-[#c82333] rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5c6cb]"
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
    </header>
  );
}