import React from 'react';

export default function LearningPatternChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No learning pattern data available
      </div>
    );
  }

  // Get last 30 days of data
  const recentData = data.slice(-30);
  const maxHours = Math.max(...recentData.map(d => d.hoursLearned));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-1">
        {recentData.map((day, index) => {
          const height = maxHours > 0 ? (day.hoursLearned / maxHours) * 100 : 0;
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = date.getDate();
          
          // Color based on hours learned
          let barColor = 'bg-gray-200';
          if (day.hoursLearned > 0) {
            if (day.hoursLearned >= 3) barColor = 'bg-green-500';
            else if (day.hoursLearned >= 2) barColor = 'bg-yellow-500';
            else if (day.hoursLearned >= 1) barColor = 'bg-blue-500';
            else barColor = 'bg-gray-400';
          }
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center mb-1" style={{ height: '200px' }}>
                <div 
                  className={`w-full max-w-6 ${barColor} rounded-t transition-all duration-300 hover:opacity-80`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${day.hoursLearned.toFixed(1)} hours, ${day.activeSessions} sessions`}
                ></div>
              </div>
              {/* Show day labels for every 5th day */}
              {index % 5 === 0 && (
                <div className="text-xs text-gray-600 text-center">
                  <div>{dayName}</div>
                  <div>{dayNumber}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span className="text-xs text-gray-600">No activity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span className="text-xs text-gray-600">&lt; 1h</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">1-2h</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-600">2-3h</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">3h+</span>
        </div>
      </div>
    </div>
  );
}
