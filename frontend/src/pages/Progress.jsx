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
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          (import.meta.env.DEV
            ? "http://localhost:5000/api"
            : "https://pluto-backend-dk2u.onrender.com/api")
        }/performance`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

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
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">Track your progress and achieve your goals</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-xl p-1 shadow-lg">
            {['overview', 'activity', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
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
          <div className="space-y-8">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Day Streak</p>
                    <p className="text-3xl font-bold">{data.dayStreak}</p>
                    <p className="text-purple-100 text-sm">Keep it up!</p>
                  </div>
                  <Flame className="w-12 h-12 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Hours Learned</p>
                    <p className="text-3xl font-bold">{data.hoursLearned}</p>
                    <p className="text-blue-100 text-sm">This month</p>
                  </div>
                  <Clock className="w-12 h-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Exercises Done</p>
                    <p className="text-3xl font-bold">{data.exercisesDone}</p>
                    <p className="text-green-100 text-sm">Total completed</p>
                  </div>
                  <Code className="w-12 h-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Success Rate</p>
                    <p className="text-3xl font-bold">{data.successRate}%</p>
                    <p className="text-orange-100 text-sm">Average score</p>
                  </div>
                  <Target className="w-12 h-12 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Active Courses</h2>
              <div className="space-y-4">
                {data.activeCourses?.map((course, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-800">{course.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">No active courses found</p>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
              <div className="flex flex-wrap gap-4">
                {['🎯 Focus Master', '⚡ Speed Demon', '🔥 Hot Streak'].map((badge, idx) => (
                  <div key={idx} className="bg-white/20 rounded-lg px-4 py-2 font-semibold shadow-lg">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Activity</h2>
            <p className="text-gray-600">Activity tracking coming soon...</p>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h2>
            <p className="text-gray-600">Performance analytics coming soon...</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
