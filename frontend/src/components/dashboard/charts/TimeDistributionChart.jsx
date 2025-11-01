import React from 'react';

export default function TimeDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No time distribution data available
      </div>
    );
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const total = data.reduce((sum, item) => sum + item.hours, 0);

  // Create pie chart using conic-gradient
  let currentAngle = 0;
  const gradientStops = data.map((item, index) => {
    const percentage = total > 0 ? (item.hours / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const color = colors[index % colors.length];
    
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    
    return `${color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="h-64 flex items-center justify-center">
      <div className="flex items-center space-x-8">
        {/* Pie Chart */}
        <div className="relative">
          <div 
            className="w-40 h-40 rounded-full"
            style={{
              background: `conic-gradient(${gradientStops})`
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{total.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.hours / total) * 100 : 0;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.category}</div>
                  <div className="text-xs text-gray-600">
                    {item.hours.toFixed(1)}h ({percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
