import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    console.log('🔄 OAuth Callback - Processing...');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔍 URL Params:', Object.fromEntries(params.entries()));
    
    const token = params.get('token');
    const error = params.get('error');
    
    if (error) {
      console.error('❌ OAuth Error:', error);
      setStatus(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    if (token) {
      console.log('✅ Token received, logging in...');
      setStatus('Authentication successful! Redirecting...');
      setToken(token);
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      console.warn('⚠️ No token found in callback');
      setStatus('No authentication token found. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [params, navigate, setToken]);

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
