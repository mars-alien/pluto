import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../asset/Logo.png';

export default function Navbar({ showNavigation = false, onLogout, onLogoClick, showBackButton = false, backTo = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar-container fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#6DD5ED] to-[#2196F3] bg-opacity-95 backdrop-blur-lg border-b border-transparent shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={onLogoClick} 
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              disabled={!onLogoClick}
            >
              <img src={Logo} alt="Pluto logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md mr-3" />
              <span className="text-xl sm:text-2xl font-bold text-white">Pluto</span>
            </button>
          </div>

          {/* Desktop Navigation - Only show if showNavigation is true */}
          {showNavigation && (
            <div className="hidden md:flex items-center space-x-3">
              {showBackButton && (
                <button
                  onClick={() => navigate(backTo)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Back to Home
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard/progress')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
                title="Learning Performance"
              >
                Performance
              </button>
              
              <button
                onClick={() => navigate('/dashboard/wishlist')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
                title="Wishlist & History"
              >
                Wishlist
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#DC3545] hover:bg-[#c82333] rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5c6cb]"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Logout
                </button>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu - Only show if showNavigation is true */}
          {showNavigation && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Single logout button for pages without navigation */}
          {!showNavigation && onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#DC3545] hover:bg-[#c82333] rounded-lg transition-all duration-200"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">
                <svg
                  className="w-4 h-4"
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

      {/* Mobile Menu Dropdown - Only show if showNavigation is true */}
      {showNavigation && isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-[#6DD5ED] to-[#2196F3] border-t border-white/20 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            
            {/* Back button */}
            {showBackButton && (
              <button
                onClick={() => {
                  navigate(backTo);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-3"
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
                Back to Home
              </button>
            )}

            {/* Performance button */}
            <button
              onClick={() => {
                navigate('/dashboard/progress');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Performance
            </button>
            
            {/* Wishlist button */}
            <button
              onClick={() => {
                navigate('/dashboard/wishlist');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Wishlist
            </button>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-white bg-[#DC3545] hover:bg-[#c82333] rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-3"
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
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
