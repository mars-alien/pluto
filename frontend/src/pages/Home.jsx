import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import OAuthButtons from "../components/OAuthButtons";
import PageLayout from "../components/PageLayout";


export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          (import.meta.env.DEV
            ? "http://localhost:5000/api"
            : "https://pluto-backend-dk2u.onrender.com/api")
        }/auth/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

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
    <PageLayout className="min-h-screen bg-gray-50 relative overflow-hidden">
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

      
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 15s infinite;
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

      {/* Main Section */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 mt-2">
        <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/40 justify-center items-center">

          {/* Right: Form Section */}
          <div className="w-full md:flex-none md:w-[550px] p-8 md:p-12 flex flex-col justify-center">
            <FormCard
              title="Welcome to Pluto"
              subtitle="Learn the essence, not just the syntax."
            >
            
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 rounded-xl bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
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
                  className="w-full p-4 bg-[#6DD5ED] text-white font-semibold rounded-xl shadow-md disabled:opacity-70 transition-all duration-200 hover:bg-[#57C3D9] hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6DD5ED]/60"
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-4 text-gray-500 font-medium bg-white/70 rounded-full border border-white/40">
                  OR
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <OAuthButtons />
              </div>
            </FormCard>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}