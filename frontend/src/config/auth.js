// Normalize backend URL so it works whether VITE_BACKEND_URL ends with /api or not
const RAW_BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
const BACKEND_BASE = RAW_BACKEND_URL.endsWith('/api') ? RAW_BACKEND_URL.replace(/\/api$/, '') : RAW_BACKEND_URL;

export const AUTH_CONFIG = {
  googleAuthUrl: `${BACKEND_BASE}/api/auth/google`,
  githubAuthUrl: `${BACKEND_BASE}/api/auth/github`,
};