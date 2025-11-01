import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AUTH_CONFIG } from "../config/auth";

export default function OAuthButtons({ action = "register" }) {
  // Pass action parameter to distinguish login vs register
  const goGoogle = () => {
    try {
      const url = `${AUTH_CONFIG.googleAuthUrl}?action=${action}`;
      console.log('🔗 Redirecting to Google OAuth:', url);
      console.log('🔍 AUTH_CONFIG:', AUTH_CONFIG);
      window.location.href = url;
    } catch (error) {
      console.error('❌ Error in Google OAuth redirect:', error);
      alert('Error redirecting to Google OAuth. Check console for details.');
    }
  };
  
  const goGitHub = () => {
    try {
      const url = `${AUTH_CONFIG.githubAuthUrl}?action=${action}`;
      console.log('🔗 Redirecting to GitHub OAuth:', url);
      console.log('🔍 AUTH_CONFIG:', AUTH_CONFIG);
      window.location.href = url;
    } catch (error) {
      console.error('❌ Error in GitHub OAuth redirect:', error);
      alert('Error redirecting to GitHub OAuth. Check console for details.');
    }
  };

  // Dynamic text based on action
  const getButtonText = (provider) => {
    const actionText = action === "login" ? "Sign in" : "Continue";
    return `${actionText} with ${provider}`;
  };

  return (
    <div className="space-y-3">
      <button
        onClick={goGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold text-gray-800 bg-white hover:shadow-lg hover:shadow-red-400/50 transition-all duration-300 border border-gray-300"
      >
        <FcGoogle size={26} /> {getButtonText("Google")}
      </button>
      <button
        onClick={goGitHub}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-800 to-black hover:shadow-lg hover:shadow-gray-600/50 transition-all duration-300"
      >
        <FaGithub size={26} /> {getButtonText("GitHub")}
      </button>
    </div>
  );
}