import React from 'react';
import Header from './Header';

export default function PageLayout({ 
  children, 
  showBackButton = false, 
  onLogout,
  className = "min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden"
}) {
  return (
    <div className={`${className} overflow-y-auto h-screen`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-orange-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header showBackButton={showBackButton} onLogout={onLogout} />
      
      {/* Add padding-top to account for fixed header */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8">
        {children}
      </main>
    </div>
  );
}