import React from 'react';

export default function WeeklyActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No activity data available
      </div>
    );
  }

  const maxHours = Math.max(...data.map(d => d.hoursLearned));
  const maxExercises = Math.max(...data.map(d => d.exercisesDone));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full space-x-2">
        {data.slice(-8).map((week, index) => {
          const hoursHeight = maxHours > 0 ? (week.hoursLearned / maxHours) * 100 : 0;
          const exercisesHeight = maxExercises > 0 ? (week.exercisesDone / maxExercises) * 100 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center space-x-1 mb-2" style={{ height: '200px' }}>
                {/* Hours bar */}
                <div className="relative flex-1 max-w-4">
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${hoursHeight}%` }}
                    title={`${week.hoursLearned.toFixed(1)} hours`}
                  ></div>
                </div>
                {/* Exercises bar */}
                <div className="relative flex-1 max-w-4">
                  <div 
                    className="bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                    style={{ height: `${exercisesHeight}%` }}
                    title={`${week.exercisesDone} exercises`}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                Week {week.week.split('-')[1]}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Hours Learned</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Exercises Done</span>
        </div>
      </div>
    </div>
  );
}
