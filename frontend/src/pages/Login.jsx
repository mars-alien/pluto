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
      className="min-h-screen bg-gray-50 relative overflow-hidden"
    >
      {/* Mesh Gradient Background - Pink-Purple-Cyan Colors */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50"></div>
        
        {/* Floating gradient orbs - Evenly distributed */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob"
             style={{background: 'linear-gradient(96deg, rgba(255, 148, 241, 0.5) 7.63%, rgba(151, 138, 255, 0.5) 37.94%, rgba(0, 210, 229, 0.5) 65.23%, rgba(143, 255, 248, 0.5) 92.12%)'}}></div>
        
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
             style={{background: 'linear-gradient(120deg, rgba(255, 148, 241, 0.5) 7.63%, rgba(151, 138, 255, 0.5) 37.94%, rgba(0, 210, 229, 0.5) 65.23%, rgba(143, 255, 248, 0.5) 92.12%)'}}></div>
        
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000"
             style={{background: 'linear-gradient(96deg, rgba(151, 138, 255, 0.5) 0%, rgba(0, 210, 229, 0.5) 50%, rgba(143, 255, 248, 0.5) 100%)'}}></div>
        
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000"
             style={{background: 'linear-gradient(140deg, rgba(0, 210, 229, 0.5) 0%, rgba(143, 255, 248, 0.5) 50%, rgba(255, 148, 241, 0.45) 100%)'}}></div>
        
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
             style={{background: 'linear-gradient(96deg, rgba(143, 255, 248, 0.5) 0%, rgba(0, 210, 229, 0.5) 50%, rgba(151, 138, 255, 0.5) 100%)'}}></div>
        
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000"
             style={{background: 'linear-gradient(180deg, rgba(255, 148, 241, 0.45) 0%, rgba(151, 138, 255, 0.5) 50%, rgba(0, 210, 229, 0.5) 100%)'}}></div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"
             style={{background: 'linear-gradient(220deg, rgba(255, 148, 241, 0.45) 0%, rgba(151, 138, 255, 0.5) 50%, rgba(143, 255, 248, 0.45) 100%)'}}></div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-7000"
             style={{background: 'linear-gradient(60deg, rgba(0, 210, 229, 0.5) 0%, rgba(143, 255, 248, 0.45) 50%, rgba(255, 148, 241, 0.45) 100%)'}}></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-500"
             style={{background: 'linear-gradient(96deg, rgba(151, 138, 255, 0.4) 0%, rgba(0, 210, 229, 0.4) 50%, rgba(143, 255, 248, 0.4) 100%)'}}></div>
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
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animation-delay-7000 {
          animation-delay: 7s;
        }
      `}</style>

      <div className="w-full max-w-xl mt-12 relative z-10">
        <FormCard>
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">Sign in to your account</p>
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
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 text-base rounded-xl bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
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
                className="w-full p-4 pl-12 text-base rounded-xl bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
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

            {/* Forgot Password Link */}
            {/* <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 relative overflow-hidden"
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
          <div className="flex items-center my-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-gray-500 font-medium bg-white/70 rounded-full border border-white/40">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <OAuthButtons action="login" />
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/register')}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>
        </FormCard>
      </div>
    </PageLayout>
  );
}