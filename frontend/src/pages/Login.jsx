import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import FormCard from "../components/FormCard";
import OAuthButtons from "../components/OAuthButtons";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const oauthError = search.get('error');
  const prefilledEmail = location.state?.email || "";
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(oauthError ? `GitHub OAuth error: ${oauthError}` : "");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error logging in", err);
      const msg = err?.response?.data?.message || "Login error";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
  };

  return (
    <PageLayout 
      showBackButton={true}
      className="min-h-screen auth-bg relative overflow-hidden"
    >
      {/* Unified Green Gradient Background - Same as Home */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"></div>
        
        {/* Animated floating gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-6000"></div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          75% {
            transform: translate(50px, 50px) scale(1.02);
          }
        }
        
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>

      <div className="w-full max-w-xl mt-12 relative z-10">
        <FormCard>
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="auth-heading">Welcome Back</h1>
            <p className="auth-subtext">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-primary-btn"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {loading && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                <span>{loading ? "Signing in..." : "Sign In"}</span>
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-2 text-gray-500 font-medium bg-white/70 rounded-full border border-white/40">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="auth-oauth">
            <OAuthButtons action="login" />
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/register')}
                className="auth-link"
              >
                Create one here
              </button>
            </p>
          </div>
        </FormCard>
      </div>
    
    <style>{`
     
      .auth-bg {
        background: linear-gradient(135deg, rgba(232,244,251,0.7) 0%, rgba(255,240,241,0.7) 50%, rgba(232,251,247,0.7) 100%);
      }
      
      .auth-heading { 
        font-family: 'Inter', sans-serif; 
        font-size: 30px; 
        font-weight: 700; 
        color: #1A1D29; 
        margin-bottom: 8px; 
      }
      
      .auth-subtext { 
        font-size: 16px; 
        font-weight: 400; 
        color: #718096; 
        margin-bottom: 24px; 
      }
      
      .auth-input { 
        width: 100%; 
        background: #FFFFFF; 
        border: 1.5px solid #E2E8F0; 
        border-radius: 8px; 
        padding: 12px 16px 12px 48px; 
        box-sizing: border-box; 
        font-size: 16px; 
        color: #1A1D29; 
        transition: all 0.2s ease; 
      }
      
      .auth-input::placeholder { 
        color: #A0AEC0; 
      }
      
      .auth-input:focus { 
        border-color: #4A9EE0; 
        box-shadow: 0 0 0 3px rgba(74,158,224,0.1); 
        outline: none; 
      }
      
      .auth-primary-btn { 
        width: 100%; 
        background: #4A9EE0; 
        color: #FFFFFF; 
        padding: 14px 24px; 
        border-radius: 8px; 
        font-weight: 500; 
        font-size: 16px; 
        border: none; 
        transition: all 0.2s ease; 
        cursor: pointer;
      }
      
      .auth-primary-btn:hover:not(:disabled) { 
        background: #3A8ED0; 
        transform: translateY(-1px); 
        box-shadow: 0 4px 12px rgba(74,158,224,0.3); 
      }
      
      .auth-primary-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      .auth-oauth > div > button:first-child { 
        background: #FFFFFF !important; 
        border: 1.5px solid #E2E8F0 !important; 
        color: #1A1D29 !important; 
        padding: 12px 24px !important; 
        border-radius: 8px !important; 
        font-weight: 500 !important; 
      }
      
      .auth-oauth > div > button:first-child:hover { 
        background: #F7FAFC !important; 
        border-color: #CBD5E0 !important; 
      }
      
      .auth-oauth > div > button:last-child { 
        background: #24292E !important; 
        color: #FFFFFF !important; 
        border: none !important; 
        padding: 12px 24px !important; 
        border-radius: 8px !important; 
        font-weight: 500 !important; 
      }
      
      .auth-oauth > div > button:last-child:hover { 
        background: #1A1F2E !important; 
      }
      
      .auth-link { 
        color: #4A9EE0; 
        font-weight: 500; 
        text-decoration: none; 
        background: transparent; 
        border: none; 
        padding: 0; 
        cursor: pointer;
      }
      
      .auth-link:hover { 
        color: #3A8ED0; 
        text-decoration: underline; 
      }
    `}</style>
    </PageLayout>
  );
}