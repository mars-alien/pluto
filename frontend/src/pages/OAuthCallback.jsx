import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
  const location = useLocation();
  const { setToken, user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [tokenProcessed, setTokenProcessed] = useState(false);

  useEffect(() => {
    // Extract token directly from URL hash
    const hash = window.location.hash.substring(1);
    const token = new URLSearchParams(hash.split('?')[1] || '').get('token');
    const error = new URLSearchParams(hash.split('?')[1] || '').get('error');

    console.log('🔄 OAuth Callback - Processing...');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔍 Token found:', !!token);

    if (error) {
      console.error('❌ OAuth Error:', error);
      setStatus(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    if (token && !tokenProcessed) {
      console.log('✅ Token received, logging in...');
      setStatus('Authentication successful! Loading user data...');
      
      // Save token to localStorage and context
      localStorage.setItem('token', token);
      setToken(token);
      setTokenProcessed(true);
      
      // Clear token from URL for security
      window.history.replaceState({}, document.title, '/');
    } else if (!token) {
      console.warn('⚠️ No token found in callback');
      setStatus('No authentication token found. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [location, navigate, setToken, tokenProcessed]);

  // Watch for user authentication completion
  useEffect(() => {
    if (tokenProcessed && !loading && user) {
      console.log('✅ User authenticated, redirecting to dashboard...');
      setStatus('Welcome! Redirecting to dashboard...');
      // Use window.location.href for reliable redirect
      setTimeout(() => {
        window.location.href = '/#/dashboard';
      }, 500);
    } else if (tokenProcessed && !loading && !user) {
      console.error('❌ Failed to authenticate user');
      setStatus('Authentication failed. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [tokenProcessed, loading, user, navigate]);

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