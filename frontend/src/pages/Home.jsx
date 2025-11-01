import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OAuthButtons from "../components/OAuthButtons";
import PageLayout from "../components/PageLayout";
import Logo from "../../asset/Logo.png";
import { API_BASE_URL } from "../config/api"; // Import centralized API config
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { setToken, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback on home page
  useEffect(() => {
    const oauth = searchParams.get('oauth');
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (oauth === 'callback') {
      if (oauthError) {
        console.error('❌ OAuth Error:', oauthError);
        setError('Authentication failed. Please try again.');
        // Clean URL
        window.history.replaceState({}, document.title, '/');
        return;
      }

      if (token) {
        console.log('✅ OAuth token received, processing...');
        setLoading(true);
        
        // Save token to localStorage and context
        localStorage.setItem('token', token);
        setToken(token);
        
        // Clean URL immediately
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [searchParams, setToken]);

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('✅ User authenticated, redirecting to dashboard...');
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
    <PageLayout className="min-h-screen home-bg relative overflow-hidden">
      {/* Background elements and styles remain unchanged */}
      {/* ... */}

      {/* Main Section */}
      <div className="relative z-10 flex items-center justify-center px-4 mt-2">
        <div className="home-card-wrapper w-full flex justify-center">
          <div className="home-card" style={{ width: '450px' }}>
            <div className="flex flex-col items-center text-center">
              <img src={Logo} alt="Pluto" className="home-logo" />
              <h1 className="text-3xl font-bold mb-1">Welcome to Pluto</h1>
              <p className="text-gray-600 mb-6">Learn the essence, not just the syntax.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* ... */}
            </form>

            {/* Divider and OAuth Buttons */}
            {/* ... */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}