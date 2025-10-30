import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OAuthCallback from '../pages/OAuthCallback';
import Dashboard from '../pages/Dashboard';

import { useAuth } from '../hooks/useAuth';


function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route 
          path="/dashboard" 
           element={
           <PrivateRoute>
            <Dashboard />
           </PrivateRoute>
        } />
         
       
      </Routes>
    </Router>
  );
}
