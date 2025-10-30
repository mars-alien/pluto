import React from 'react';

const DashboardSidebar = ({ rightWidth }) => {
  const panelStyle = {
    width: window.innerWidth >= 1024 ? `${rightWidth}%` : '100%'
  };

  return (
    <div 
      className="hidden lg:flex w-full lg:w-auto flex-1 flex-col mt-4 lg:mt-0"
      style={panelStyle}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6 flex-1 overflow-auto">
        
        {/* Placeholder for Quiz/Code Editor */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <div className="text-3xl sm:text-4xl mb-3">💻</div>
          <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Code Editor</h4>
          <p className="text-xs sm:text-sm text-gray-600">
            This section will contain code editor for learning exercises.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;