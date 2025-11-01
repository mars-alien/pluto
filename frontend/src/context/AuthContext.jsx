import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';


export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // Read token from localStorage once on initialization
  const initialToken = localStorage.getItem('token');
  const [token, setTokenState] = useState(initialToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!initialToken);


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchOAuthUser();
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
     
    }

  }, [token]);

  const fetchOAuthUser = async () => {
    try { 
      setLoading(true);
      console.log('🔄 Fetching user data...');
      const res = await api.get('/auth/me');
      console.log('✅ User data received:', res.data.user);
      setUser(res.data.user);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err.response?.data || err.message);
      setUser(null);
      // Clear invalid token
      localStorage.removeItem('token');
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    setTokenState(res.data.token);
    setUser(res.data.user);
  };

  const register = async ({ name, email, password, code }) => {
    const res = await api.post('/auth/register', { name, email, password, code });
    setTokenState(res.data.token);
    setUser(res.data.user);
  };

  const setToken = (t) => setTokenState(t);

  const logout = () => {
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
