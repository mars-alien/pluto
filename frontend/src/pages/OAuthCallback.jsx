import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
  const location = useLocation();
  const { setToken } = useAuth();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    // Parse hash fragment (e.g., #/oauth/callback?token=abc)
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash.split('?')[1] || '');
    
    console.log('🔄 OAuth Callback - Processing...');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔍 URL Params:', Object.fromEntries(params.entries()));
    
    const token = params.get('token');
    const error = params.get('error');
    
    if (error) {
      console.error('❌ OAuth Error:', error);
      setStatus(`Authentication failed: ${error}`);
      setTimeout(() => window.location.href = '/', 3000);
      return;
    }
    
    if (token) {
      console.log('✅ Token received, logging in...');
      setStatus('Authentication successful! Redirecting...');
      setToken(token);
      
      // SECURITY: Clear token from URL and history
      window.history.replaceState({}, document.title, '/');
      
      // FORCE redirect to dashboard (bypass React Router)
      window.location.href = '/#/dashboard';
    } else {
      console.warn('⚠️ No token found in callback');
      setStatus('No authentication token found. Redirecting...');
      setTimeout(() => window.location.href = '/', 2000);
    }
  }, [location, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
