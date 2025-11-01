import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import FormCard from "../components/FormCard";
import OAuthButtons from "../components/OAuthButtons";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

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


      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-6 sm:mt-8 lg:mt-12 relative z-10 px-4 sm:px-6 lg:px-8">
        <FormCard>
          {/* Title */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="auth-heading">Welcome Back</h1>
            <p className="auth-subtext">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium text-sm sm:text-base">{message}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
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
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">
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
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400">
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
          <div className="flex items-center my-3 sm:my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-500 font-medium bg-white/70 rounded-full border border-white/40">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="auth-oauth space-y-2 sm:space-y-3">
            <OAuthButtons action="login" />
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50 text-center">
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
    </PageLayout>
  );
}