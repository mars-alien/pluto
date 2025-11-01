import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
  const location = useLocation();
  const { setToken } = useAuth();

  useEffect(() => {
    // Extract token directly from URL hash
    const hash = window.location.hash.substring(1);
    const token = new URLSearchParams(hash.split('?')[1] || '').get('token');
    const error = new URLSearchParams(hash.split('?')[1] || '').get('error');

    if (error) {
      console.error('❌ OAuth Error:', error);
      // Redirect to login with error
      window.location.href = `/?error=oauth_failed&message=${encodeURIComponent(error)}`;
      return;
    }
    
    if (token) {
      console.log('✅ Token received, logging in...');
      // Save token to localStorage and context
      localStorage.setItem('token', token);
      setToken(token);
      
      // SECURITY: Clear token from URL
      window.history.replaceState({}, document.title, '/');
      
      // FULL PAGE REDIRECT to dashboard
      window.location.href = '/#/dashboard';
    } else {
      console.warn('⚠️ No token found in callback');
      // Redirect to home
      window.location.href = '/';
    }
  }, [location, setToken]);

  // Minimal UI since redirect happens quickly
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Processing authentication...</h2>
      </div>
    </div>
  );
}
