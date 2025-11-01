// Get backend URL from environment variables with proper fallback
const getBackendUrl = () => {
  try {
    // Debug logging
    console.log('🔍 Environment Detection:');
    console.log('- window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : 'undefined');
    console.log('- import.meta.env.VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('- import.meta.env.MODE:', import.meta.env.MODE);
    console.log('- import.meta.env.PROD:', import.meta.env.PROD);
    
    // Force production URL if we're on Render
    if (typeof window !== 'undefined' && 
        (window.location.hostname.includes('render.com') || 
         window.location.hostname.includes('plutogenz'))) {
      console.log('✅ Detected Render deployment - using production URL');
      return 'https://plutogen.onrender.com';
    }
    
    // Try to get from environment variable
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl !== 'undefined') {
      console.log('✅ Using environment variable:', envUrl);
      // Remove /api suffix if present to get base URL
      return envUrl.replace(/\/api$/, '').replace(/\/$/, '');
    }
    
    // Fallback for local development
    console.log('⚠️ Using localhost fallback');
    return 'http://localhost:5000';
    
  } catch (error) {
    console.error('❌ Error in getBackendUrl:', error);
    return 'http://localhost:5000';
  }
};

const BACKEND_BASE = getBackendUrl();

export const AUTH_CONFIG = {
  googleAuthUrl: `${BACKEND_BASE}/api/auth/google`,
  githubAuthUrl: `${BACKEND_BASE}/api/auth/github`,
};

// Enhanced debug logging
console.log('🚀 AUTH CONFIG:');
console.log('- Backend Base:', BACKEND_BASE);
console.log('- Google Auth URL:', AUTH_CONFIG.googleAuthUrl);
console.log('- GitHub Auth URL:', AUTH_CONFIG.githubAuthUrl);