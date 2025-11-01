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
  // URL Masking Effect - Hides hash from browser address bar
  React.useEffect(() => {
    const handleHashChange = () => {
      // Get current hash path (remove # character)
      const hashPath = window.location.hash.substring(1);
      
      // Only update URL if we're not at root
      if (hashPath && hashPath !== '/') {
        // Replace URL in address bar without hash
        window.history.replaceState(null, '', hashPath);
      }
    };

    // Set up event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial call to set up URL masking
    handleHashChange();

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