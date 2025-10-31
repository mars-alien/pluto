import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-teal-50 relative overflow-hidden"
    >
      {/* Mesh Gradient Background - Tailwind only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left orb */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-yellow-200 via-green-200 to-cyan-200 mix-blend-multiply blur-3xl"></div>
        {/* Top right orb */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-yellow-200 via-cyan-200 to-blue-200 mix-blend-multiply blur-3xl"></div>
        {/* Center left orb */}
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-green-200 via-cyan-200 to-blue-200 mix-blend-multiply blur-3xl"></div>
        {/* Center right orb */}
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-200 via-blue-200 to-teal-200 mix-blend-multiply blur-3xl"></div>
        {/* Bottom left orb */}
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-200 via-blue-200 to-teal-200 mix-blend-multiply blur-3xl"></div>
        {/* Bottom right orb */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-green-200 via-cyan-200 to-blue-200 mix-blend-multiply blur-3xl"></div>
        {/* Center top orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-yellow-100 via-cyan-100 to-blue-100 mix-blend-multiply blur-3xl"></div>
        {/* Center bottom orb */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-100 via-blue-100 to-teal-100 mix-blend-multiply blur-3xl"></div>
        {/* Center orb for blending */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-green-100 via-cyan-100 to-blue-100 mix-blend-multiply blur-3xl"></div>
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

      <div className="w-full max-w-xl mt-4 relative z-10 flex justify-center">
        <div className="register-card-wrapper  w-full flex justify-center">
          <div className="register-card">
          {step === "form" ? (
            <>
              {/* Registration Form */}
              <div className="text-center mb-1">
                <h1 className="register-heading">Create Account</h1>
                <p className="register-subtext">Learn the essence, not just the syntax.</p>
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

              <form onSubmit={handleRegister} className="space-y-2">
                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="register-input"
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
                    className="register-input"
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
                    className="register-input"
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
                  className="register-primary-btn"
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
              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-2 text-gray-500 font-medium bg-white/70 rounded-full border border-white/40">
                  OR
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              <div className="register-oauth">
                <OAuthButtons action="register" />
              </div>
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
                    className="register-input register-code-input"
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
                  className="register-primary-btn"
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
                className="register-signin-link"
              >
                Sign in here
              </button>
            </p>
          </div>
          </div>
        </div>
      </div>
    
    <style>{`
    
  /* Removed all custom styles. Only Tailwind utility classes are used for background and effects. */

     
      .register-card-wrapper { width: 100%; display: flex; justify-content: center; }
      .register-card {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        padding: 25px;
        max-width: 440px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Typography */
      .register-heading {
        font-family: 'Inter', sans-serif;
        font-size: 30px;
        font-weight: 700;
        color: #1A1D29;
        margin-bottom: 2px;
      }
      .register-subtext {
        font-size: 16px;
        font-weight: 400;
        color: #718096;
        margin-bottom: 32px;
      }

      /* INPUTS */
      .register-input {
        width: 100%;
        background: #FFFFFF;
        border: 1.5px solid #E2E8F0;
        border-radius: 8px;
        /* leave room on the left for the inline icon */
        padding: 12px 16px 12px 48px;
        box-sizing: border-box;
        font-size: 16px;
        color: #1A1D29;
        transition: all 0.2s ease;
      }
      .register-input::placeholder { color: #A0AEC0; }
      .register-input:focus {
        border-color: #4A9EE0;
        box-shadow: 0 0 0 3px rgba(74, 158, 224, 0.1);
        outline: none;
      }
  .register-code-input { text-align: center; font-size: 28px; letter-spacing: 8px; padding: 16px; }

      /* PRIMARY BUTTON */
      .register-primary-btn {
        width: 100%;
        background: #4A9EE0;
        color: #FFFFFF;
        padding: 14px 24px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 16px;
        border: none;
        transition: all 0.2s ease;
      }
      .register-primary-btn:hover:not(:disabled) {
        background: #3A8ED0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(74, 158, 224, 0.3);
      }
      .register-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      /* OAUTH BUTTONS */
      .register-oauth > div > button:first-child {
        background: #FFFFFF !important;
        border: 1.5px solid #E2E8F0 !important;
        color: #1A1D29 !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
      }
      .register-oauth > div > button:first-child:hover { background: #F7FAFC !important; border-color: #CBD5E0 !important; }

      .register-oauth > div > button:last-child {
        background: #24292E !important;
        color: #FFFFFF !important;
        border: none !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
      }
      .register-oauth > div > button:last-child:hover { background: #1A1F2E !important; }

      /* Sign-in link */
      .register-signin-link {
        color: #4A9EE0;
        font-weight: 500;
        text-decoration: none;
        background: transparent;
        border: none;
        padding: 0;
      }
      .register-signin-link:hover { color: #3A8ED0; text-decoration: underline; }
    `}</style>
    </PageLayout>
  );
}