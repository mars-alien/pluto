import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import FormCard from "../components/FormCard";
import OAuthButtons from "../components/OAuthButtons";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const params = new URLSearchParams(location.search);
  const prefilledEmail = params.get('email') || location.state?.email || "";
  const prefilledName = params.get('name') || "";

  const [step, setStep] = useState("form"); // "form" or "verify"
  const [email, setEmail] = useState(prefilledEmail);
  const [name, setName] = useState(prefilledName);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      if (!name || !password || !email) {
        setMessage("Name, email and password are required");
        setLoading(false);
        return;
      }
      const res = await api.post('/auth/send-code', { email });
      if (res.status === 200) {
        setStep("verify");
        setMessage("Verification code sent to your email.");
        setResendTimer(30); // 30s cooldown
      } else {
        setMessage("Failed to send verification code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      await register({ name, email, password, code });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Registration failed";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/send-code', { email });
      if (res.status === 200) {
        setMessage("New code sent!");
        setResendTimer(30);
      } else {
        setMessage("Failed to resend code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setCode("");
    setMessage("");
  };

  return (
    <PageLayout 
      showBackButton={true}
      className="min-h-screen bg-gray-50 relative overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50"></div>
        
        {/* Floating gradient orbs - Evenly distributed */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob"
             style={{background: 'linear-gradient(96deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.35) 50%, rgba(168, 85, 247, 0.4) 100%)'}}></div>
        
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
             style={{background: 'linear-gradient(120deg, rgba(168, 85, 247, 0.4) 0%, rgba(217, 70, 239, 0.35) 50%, rgba(236, 72, 153, 0.4) 100%)'}}></div>
        
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000"
             style={{background: 'linear-gradient(96deg, rgba(79, 70, 229, 0.4) 0%, rgba(99, 102, 241, 0.35) 50%, rgba(139, 92, 246, 0.4) 100%)'}}></div>
        
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000"
             style={{background: 'linear-gradient(140deg, rgba(249, 115, 22, 0.35) 0%, rgba(251, 146, 60, 0.4) 50%, rgba(253, 186, 116, 0.35) 100%)'}}></div>
        
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
             style={{background: 'linear-gradient(96deg, rgba(139, 92, 246, 0.4) 0%, rgba(168, 85, 247, 0.35) 50%, rgba(192, 132, 252, 0.4) 100%)'}}></div>
        
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000"
             style={{background: 'linear-gradient(180deg, rgba(236, 72, 153, 0.35) 0%, rgba(244, 114, 182, 0.4) 50%, rgba(251, 146, 60, 0.35) 100%)'}}></div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000"
             style={{background: 'linear-gradient(220deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.4) 50%, rgba(168, 85, 247, 0.35) 100%)'}}></div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-7000"
             style={{background: 'linear-gradient(60deg, rgba(217, 70, 239, 0.35) 0%, rgba(236, 72, 153, 0.35) 50%, rgba(249, 115, 22, 0.4) 100%)'}}></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-500"
             style={{background: 'linear-gradient(96deg, rgba(168, 85, 247, 0.3) 0%, rgba(192, 132, 252, 0.35) 50%, rgba(217, 70, 239, 0.3) 100%)'}}></div>
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
          {step === "form" ? (
            <>
              {/* Registration Form */}
              <div className="text-center mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-3">
                  Create Account
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">Learn the essence, not just the syntax.</p>
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

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 pl-12 text-base rounded-xl bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
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
                    placeholder="Create Password"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-4 bg-[#6DD5ED] text-white font-semibold rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[#57C3D9] hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#6DD5ED]/60"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {loading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    <span>{loading ? "Creating Account..." : "Create Account"}</span>
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

              <OAuthButtons action="register" />
            </>
          ) : (
            <>
              {/* Verification Step */}
              <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-3">
                  Check Your Email
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mb-4">
                  We've sent a verification code to
                </p>
                <p className="text-purple-600 font-semibold bg-purple-50 rounded-lg px-4 py-2 inline-block">
                  {email}
                </p>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`mb-6 p-4 ${message.includes("sent") || message.includes("New code") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-5 h-5 ${message.includes("sent") || message.includes("New code") ? "bg-green-500" : "bg-red-500"} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {message.includes("sent") || message.includes("New code") ? "✓" : "!"}
                      </span>
                    </div>
                    <p className={`${message.includes("sent") || message.includes("New code") ? "text-green-700" : "text-red-700"} font-medium`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-5 pl-12 text-center text-2xl tracking-widest rounded-xl bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                    maxLength="6"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-4 bg-[#6DD5ED] text-white font-semibold rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[#57C3D9] hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#6DD5ED]/60"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {loading && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    <span>{loading ? "Verifying..." : "Verify Account"}</span>
                  </span>
                </button>
              </form>

              <div className="mt-4 space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="w-full p-4 bg-white/80 hover:bg-white border border-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend Verification Code"}
                </button>

                <button
                  onClick={handleBackToForm}
                  className="w-full p-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  ← Back to Registration
                </button>
              </div>
            </>
          )}

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </FormCard>
      </div>
    </PageLayout>
  );
}