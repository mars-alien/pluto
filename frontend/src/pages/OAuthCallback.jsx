import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setToken(token);
      
      navigate('/dashboard');
    } else {
     
      navigate('/');
    }
  }, [params, navigate, setToken]);

  return <div className="p-6 text-center">Signing you in...</div>;
}
