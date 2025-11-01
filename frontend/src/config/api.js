// Centralized API configuration
const getApiUrl = () => {
  // In production on Render, use the deployed backend URL
  if (typeof window !== 'undefined' && window.location.hostname.includes('render.com')) {
    return 'https://plutogen.onrender.com/api';
  }
  
  // Try to get from environment variable
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback for local development
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiUrl();

// Debug logging (remove in production)
console.log('API Base URL:', API_BASE_URL);
