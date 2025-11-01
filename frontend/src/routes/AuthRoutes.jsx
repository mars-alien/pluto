import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OAuthCallback from '../pages/OAuthCallback';
import Dashboard from '../pages/Dashboard';
import Wishlist from '../pages/Wishlist';
import Progress from '../pages/Progress';
import Editor from '../pages/Editor';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  // URL Masking Effect - Hides hash but preserves query parameters
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;
      
      // Extract path and query parameters
      const [path, query] = hash.split('?');
      
      // For OAuth callback, don't mask the URL
      if (path.includes('oauth/callback') || path.includes('auth/callback')) {
        return;
      }
      
      // Build new URL with query parameters
      const newUrl = query ? `${path}?${query}` : path;
      
      // Replace URL in address bar
      window.history.replaceState(null, '', newUrl);
    };

    // Set up event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial call to set up URL masking
    handleHashChange();
    
    // Clean up token from URL after OAuth
    const currentPath = window.location.pathname;
    if (currentPath.includes('oauth/callback') || currentPath.includes('auth/callback')) {
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/dashboard');
      }, 1000);
    }

    // Clean up event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/wishlist" 
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />
        <Route 
          path="/dashboard/progress" 
          element={
            <PrivateRoute>
              <Progress />
            </PrivateRoute>
          }
        />
        <Route 
          path="/dashboard/editor/:videoId?" 
          element={
            <PrivateRoute>
              <Editor />
            </PrivateRoute>
          }
        />
        {/* Catch-all route for 404s */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
