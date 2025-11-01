import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OAuthButtons from "../components/OAuthButtons";
import PageLayout from "../components/PageLayout";
import Logo from "../../asset/Logo.png";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../hooks/useAuth";
import "./Home.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { setToken, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback on home page (temporary workaround for static hosting)
  useEffect(() => {
    const oauth = searchParams.get('oauth');
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (oauth === 'callback') {
      if (oauthError) {
        setError('Authentication failed. Please try again.');
        window.history.replaceState({}, document.title, '/');
        return;
      }

      if (token) {
        setLoading(true);
        localStorage.setItem('token', token);
        setToken(token);
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [searchParams, setToken]);

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      // Use centralized API configuration
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (data.exists) navigate("/login", { state: { email } });
      else navigate("/register", { state: { email } });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout 
      className="min-h-screen home-bg relative overflow-hidden"
    >
      {/* Mesh Gradient Background - AWS Colors Distributed Evenly */}
      <div className="absolute inset-0 overflow-hidden bg-white">
        {/* Top left area */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob"
             style={{background: 'linear-gradient(96deg, rgba(254, 245, 113, 0.5) 0%, rgba(174, 255, 168, 0.5) 29.94%, rgba(143, 255, 206, 0.5) 66.98%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
        
        {/* Top right area */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
             style={{background: 'linear-gradient(120deg, rgba(254, 245, 113, 0.5) 0%, rgba(143, 255, 206, 0.5) 51.33%, rgba(153, 247, 255, 0.5) 87.79%)'}}></div>
        
        {/* Center left */}
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000"
             style={{background: 'linear-gradient(96deg, rgba(174, 255, 168, 0.5) 0%, rgba(143, 255, 206, 0.5) 50%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
        
        {/* Center right */}
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000"
             style={{background: 'linear-gradient(140deg, rgba(143, 255, 206, 0.5) 28.41%, rgba(153, 247, 255, 0.5) 69.04%)'}}></div>
        
        {/* Bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
             style={{background: 'linear-gradient(96deg, rgba(143, 255, 206, 0.5) 28.41%, rgba(153, 247, 255, 0.5) 69.04%)'}}></div>
        
        {/* Bottom right */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000"
             style={{background: 'linear-gradient(180deg, rgba(174, 255, 168, 0.5) 0%, rgba(143, 255, 206, 0.5) 50%, rgba(153, 247, 255, 0.5) 100%)'}}></div>
        
        {/* Center top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"
             style={{background: 'linear-gradient(220deg, rgba(254, 245, 113, 0.45) 0%, rgba(143, 255, 206, 0.45) 51.33%, rgba(153, 247, 255, 0.45) 87.79%)'}}></div>
        
        {/* Center bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-7000"
             style={{background: 'linear-gradient(60deg, rgba(143, 255, 206, 0.45) 28.41%, rgba(153, 247, 255, 0.45) 69.04%)'}}></div>
        
        {/* Center orb for blending */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-500"
             style={{background: 'linear-gradient(96deg, rgba(174, 255, 168, 0.4) 0%, rgba(143, 255, 206, 0.4) 50%, rgba(153, 247, 255, 0.4) 100%)'}}></div>
      </div>


      {/* Main Section */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-2">
        <div className="home-card-wrapper w-full flex justify-center">
          <div className="home-card w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="flex flex-col items-center text-center">
              <img src={Logo} alt="Pluto" className="home-logo" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Welcome to Pluto</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 px-2">Learn the essence, not just the syntax.</p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="home-input"
                  disabled={loading}
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="home-primary-btn"
              >
                {loading ? "Checking..." : "Continue"}
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
            <div className="space-y-2 sm:space-y-3">
              <OAuthButtons />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}