import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Trophy, Flame, Code, Video, Clock, TrendingUp, Target, Award, BookOpen, Zap } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function Progress() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Use the same backend URL logic as other pages
      const getBackendUrl = () => {
        if (typeof window !== 'undefined' && 
            (window.location.hostname.includes('render.com') || 
             window.location.hostname.includes('plutogenz'))) {
          return 'https://plutogen.onrender.com';
        }
        const envUrl = import.meta.env.VITE_BACKEND_URL;
        if (envUrl && envUrl !== 'undefined') {
          return envUrl.replace(/\/api$/, '').replace(/\/$/, '');
        }
        return 'http://localhost:5000';
      };
      
      const response = await fetch(`${getBackendUrl()}/api/performance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }

      const data = await response.json();
      setPerformanceData(data);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <PageLayout
        onLogout={handleLogout}
        className="min-h-screen relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
        onLogoClick={() => navigate('/dashboard')}
        showBackButton={true}
        backTo="/dashboard"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading your learning performance...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        onLogout={handleLogout}
        className="min-h-screen relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
        onLogoClick={() => navigate('/dashboard')}
        showBackButton={true}
        backTo="/dashboard"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Mock data for demo purposes
  const data = performanceData || {
    dayStreak: 7,
    hoursLearned: 75,
    exercisesDone: 142,
    successRate: 89,
    activeCourses: [
      { name: 'JavaScript Fundamentals', progress: 75 },
      { name: 'React Development', progress: 60 },
      { name: 'Node.js Backend', progress: 40 }
    ]
  };

  return (
    <PageLayout
      onLogout={handleLogout}
      className="min-h-screen relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
      onLogoClick={() => navigate('/dashboard')}
      showBackButton={true}
      backTo="/dashboard"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Page Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Learning Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your progress and achieve your goals</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-white rounded-xl p-1 shadow-lg w-full max-w-md sm:w-auto">
            {['overview', 'activity', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm">Day Streak</p>
                    <p className="text-2xl sm:text-3xl font-bold">{data.dayStreak}</p>
                    <p className="text-purple-100 text-xs sm:text-sm">Keep it up!</p>
                  </div>
                  <Flame className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Hours Learned</p>
                    <p className="text-2xl sm:text-3xl font-bold">{data.hoursLearned}</p>
                    <p className="text-blue-100 text-xs sm:text-sm">This month</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Exercises Done</p>
                    <p className="text-2xl sm:text-3xl font-bold">{data.exercisesDone}</p>
                    <p className="text-green-100 text-xs sm:text-sm">Total completed</p>
                  </div>
                  <Code className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">Success Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold">{data.successRate}%</p>
                    <p className="text-orange-100 text-xs sm:text-sm">Average score</p>
                  </div>
                  <Target className="w-8 h-8 sm:w-12 sm:h-12 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Active Courses</h2>
              <div className="space-y-3 sm:space-y-4">
                {data.activeCourses?.map((course, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{course.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-1 sm:w-24 lg:w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-[3rem]">{course.progress}%</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No active courses found</p>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Achievements</h2>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {['🎯 Focus Master', '⚡ Speed Demon', '🔥 Hot Streak'].map((badge, idx) => (
                  <div key={idx} className="bg-white/20 rounded-lg px-3 py-2 sm:px-4 font-semibold shadow-lg text-sm sm:text-base">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Weekly Learning Activity</h2>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const hours = [2.5, 3.2, 1.8, 4.1, 2.9, 1.5, 3.7][index];
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 truncate">{day}</div>
                      <div className="bg-gray-100 rounded-md sm:rounded-lg h-16 sm:h-24 lg:h-32 flex items-end p-1 sm:p-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm sm:rounded transition-all duration-300"
                          style={{ height: `${(hours / 5) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">{hours}h</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Learning Streak</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{data.dayStreak} Days</p>
                    <p className="text-sm text-gray-600">Current streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">+{data.hoursLearned}h</p>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
            </div>

            {/* Time Distribution */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Time Distribution</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { activity: 'Video Watching', time: 45, color: 'bg-blue-500' },
                  { activity: 'Coding Practice', time: 30, color: 'bg-green-500' },
                  { activity: 'Reading Docs', time: 15, color: 'bg-yellow-500' },
                  { activity: 'Project Work', time: 10, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.activity} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`}></div>
                      <span className="text-sm sm:text-base font-medium text-gray-700">{item.activity}</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                      <div className="flex-1 sm:w-16 lg:w-20 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-300 ${item.color}`} style={{ width: `${item.time}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[2rem] text-right">{item.time}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Skills Progress */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Skills Progress</h2>
              <div className="space-y-3 sm:space-y-4">
                {(data.skillsProgress || [
                  { skill: 'JavaScript', level: 75, exercisesCompleted: 45 },
                  { skill: 'React', level: 60, exercisesCompleted: 32 },
                  { skill: 'Node.js', level: 40, exercisesCompleted: 18 },
                  { skill: 'CSS', level: 85, exercisesCompleted: 52 }
                ]).map((skill, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{skill.skill}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{skill.exercisesCompleted} exercises completed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                      <div className="flex-1 sm:w-20 lg:w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-[2.5rem] text-right">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quiz Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-semibold text-green-600">{data.averageQuizScore || 87}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quizzes Taken</span>
                    <span className="font-semibold">{data.totalQuizzesTaken || 24}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-blue-600">{data.successRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Project Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{data.projectsCompleted || 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-semibold text-orange-600">{data.projectsInProgress || 2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Hours</span>
                    <span className="font-semibold">{data.hoursLearned}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
                {(data.achievements || [
                  { name: 'First Steps', badge: '🎯', description: 'Completed first exercise' },
                  { name: 'Code Warrior', badge: '⚔️', description: 'Solved 50 problems' },
                  { name: 'Speed Demon', badge: '⚡', description: 'Fast completion streak' },
                  { name: 'Night Owl', badge: '🦉', description: 'Late night coding' },
                  { name: 'Problem Solver', badge: '🧩', description: 'Solved complex problems' },
                  { name: 'Consistent', badge: '📅', description: '7-day streak' }
                ]).slice(0, 8).map((achievement, index) => (
                  <div key={index} className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-xl sm:text-2xl mb-1">{achievement.badge}</div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
