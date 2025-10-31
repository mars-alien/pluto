import React from 'react';

export default function FormCard({ children, title, subtitle }) {
  return (
    <div className="w-full max-w-md min-w-[380px] mx-auto">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl -z-10">
          {/* Base gradient matching the image */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"></div>
          
          {/* Flowing gradient orbs - Left to Right */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl animate-flow-lr"
               style={{background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.4) 0%, rgba(236, 72, 153, 0.35) 100%)'}}></div>
          
          <div className="absolute top-1/4 left-0 w-44 h-44 rounded-full mix-blend-multiply filter blur-2xl animate-flow-lr animation-delay-2000"
               style={{background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.4) 0%, rgba(167, 139, 250, 0.35) 100%)'}}></div>
          
          <div className="absolute top-1/2 left-0 w-52 h-52 rounded-full mix-blend-multiply filter blur-2xl animate-flow-lr animation-delay-4000"
               style={{background: 'linear-gradient(135deg, rgba(221, 214, 254, 0.45) 0%, rgba(196, 181, 253, 0.4) 100%)'}}></div>
          
          <div className="absolute top-3/4 left-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-2xl animate-flow-lr animation-delay-3000"
               style={{background: 'linear-gradient(135deg, rgba(165, 180, 252, 0.4) 0%, rgba(129, 140, 248, 0.35) 100%)'}}></div>
          
          <div className="absolute bottom-0 left-0 w-46 h-46 rounded-full mix-blend-multiply filter blur-2xl animate-flow-lr animation-delay-1000"
               style={{background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.4) 0%, rgba(244, 114, 182, 0.35) 100%)'}}></div>
        </div>

        {/* Animated CSS */}
        <style jsx>{`
          @keyframes flow-lr {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(100vw));
            }
          }
          
          .animate-flow-lr {
            animation: flow-lr 25s infinite linear;
          }
          
          .animation-delay-1000 {
            animation-delay: -5s;
          }
          
          .animation-delay-2000 {
            animation-delay: -10s;
          }
          
          .animation-delay-3000 {
            animation-delay: -15s;
          }
          
          .animation-delay-4000 {
            animation-delay: -20s;
          }
        `}</style>
        
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8 relative z-10">
            {title && (
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 text-lg">{subtitle}</p>
            )}
          </div>
        )}

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}