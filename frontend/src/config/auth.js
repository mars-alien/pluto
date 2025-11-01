// Get backend URL from environment variables with proper fallback
const getBackendUrl = () => {
  // In production, use the deployed backend URL
  if (typeof window !== 'undefined' && window.location.hostname.includes('render.com')) {
    return 'https://plutogen.onrender.com';
  }
  
  // Try to get from environment variable
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    // Remove /api suffix if present to get base URL
    return envUrl.replace(/\/api$/, '').replace(/\/$/, '');
  }
  
  // Fallback for local development
  return 'http://localhost:5000';
};

const BACKEND_BASE = getBackendUrl();

export const AUTH_CONFIG = {
  googleAuthUrl: `${BACKEND_BASE}/api/auth/google`,
  githubAuthUrl: `${BACKEND_BASE}/api/auth/github`,
};

// Debug logging (remove in production)
console.log('Backend URL:', BACKEND_BASE);
console.log('Google Auth URL:', AUTH_CONFIG.googleAuthUrl);