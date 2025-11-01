const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
  skill: { type: String, required: true }, // e.g., 'Python', 'JavaScript', 'SQL'
  level: { type: Number, default: 0, min: 0, max: 100 }, // Progress percentage
  exercisesCompleted: { type: Number, default: 0 },
  firstAttemptSuccess: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const weeklyActivitySchema = new mongoose.Schema({
  week: { type: String, required: true }, // Format: 'YYYY-WW'
  hoursLearned: { type: Number, default: 0 },
  exercisesDone: { type: Number, default: 0 },
  videosWatched: { type: Number, default: 0 }
});

const timeDistributionSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., 'Videos', 'Exercises', 'Projects'
  hours: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 }
});

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  badge: { type: String, required: true }, // Badge icon or image URL
  earnedAt: { type: Date, default: Date.now },
  category: { type: String, required: true } // e.g., 'streak', 'completion', 'skill'
});

const learningPatternSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  hoursLearned: { type: Number, default: 0 },
  activeSessions: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0, min: 0, max: 100 } // Based on session completion rates
});

const learningPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Stats
  dayStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  totalHoursLearned: { type: Number, default: 0 },
  totalExercisesDone: { type: Number, default: 0 },
  exerciseSuccessRate: { type: Number, default: 0 }, // Percentage
  
  // Active Courses
  activeCourses: [{
    name: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    hoursSpent: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now }
  }],
  
  // Weekly Activity (last 12 weeks)
  weeklyActivity: [weeklyActivitySchema],
  
  // Time Distribution
  timeDistribution: [timeDistributionSchema],
  
  // Learning Patterns (last 30 days)
  learningPatterns: [learningPatternSchema],
  
  // Skills Progress
  skillsProgress: [skillProgressSchema],
  
  // Quiz Performance
  averageQuizScore: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  
  // Projects
  projectsCompleted: { type: Number, default: 0 },
  projectsInProgress: { type: Number, default: 0 },
  
  // Achievements
  achievements: [achievementSchema],
  
  // Last activity tracking
  lastActiveDate: { type: Date, default: Date.now },
  lastStreakDate: { type: Date, default: Date.now },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
learningPerformanceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get or create performance record
learningPerformanceSchema.statics.getOrCreate = async function(userId) {
  let performance = await this.findOne({ userId });
  
  if (!performance) {
    // Create default performance record
    performance = new this({
      userId,
      activeCourses: [
        { name: 'Python', progress: 15, hoursSpent: 8.5 },
        { name: 'Web Development', progress: 32, hoursSpent: 12.3 },
        { name: 'Data Structures', progress: 8, hoursSpent: 3.2 }
      ],
      skillsProgress: [
        { skill: 'Python', level: 25, exercisesCompleted: 15, firstAttemptSuccess: 12, totalAttempts: 18, averageScore: 78 },
        { skill: 'JavaScript', level: 40, exercisesCompleted: 28, firstAttemptSuccess: 22, totalAttempts: 35, averageScore: 82 },
        { skill: 'SQL', level: 15, exercisesCompleted: 8, firstAttemptSuccess: 6, totalAttempts: 12, averageScore: 71 }
      ],
      timeDistribution: [
        { category: 'Videos', hours: 45.5, percentage: 60 },
        { category: 'Exercises', hours: 22.3, percentage: 30 },
        { category: 'Projects', hours: 7.5, percentage: 10 }
      ],
      achievements: [
        {
          id: 'first_week',
          name: 'First Week Complete',
          description: 'Completed your first week of learning',
          badge: '🎯',
          category: 'streak'
        },
        {
          id: 'python_basics',
          name: 'Python Basics',
          description: 'Mastered Python fundamentals',
          badge: '🐍',
          category: 'skill'
        }
      ]
    });
    
    // Generate sample weekly activity (last 12 weeks)
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const week = `${date.getFullYear()}-${String(Math.ceil(date.getDate() / 7)).padStart(2, '0')}`;
      weeks.push({
        week,
        hoursLearned: Math.floor(Math.random() * 15) + 5,
        exercisesDone: Math.floor(Math.random() * 10) + 2,
        videosWatched: Math.floor(Math.random() * 8) + 3
      });
    }
    performance.weeklyActivity = weeks;
    
    // Generate sample learning patterns (last 30 days)
    const patterns = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      patterns.push({
        date: dateStr,
        hoursLearned: Math.random() * 4,
        activeSessions: Math.floor(Math.random() * 3) + 1,
        focusScore: Math.floor(Math.random() * 40) + 60
      });
    }
    performance.learningPatterns = patterns;
    
    // Set some realistic default values
    performance.dayStreak = 7;
    performance.maxStreak = 12;
    performance.totalHoursLearned = 75.3;
    performance.totalExercisesDone = 51;
    performance.exerciseSuccessRate = 76;
    performance.averageQuizScore = 77;
    performance.totalQuizzesTaken = 23;
    performance.projectsCompleted = 3;
    performance.projectsInProgress = 2;
    
    await performance.save();
  }
  
  return performance;
};

// Method to update daily activity
learningPerformanceSchema.methods.updateDailyActivity = function(hoursLearned, exercisesDone, videosWatched) {
  const today = new Date().toISOString().split('T')[0];
  const existingPattern = this.learningPatterns.find(p => p.date === today);
  
  if (existingPattern) {
    existingPattern.hoursLearned += hoursLearned;
    existingPattern.activeSessions += 1;
  } else {
    this.learningPatterns.push({
      date: today,
      hoursLearned,
      activeSessions: 1,
      focusScore: Math.floor(Math.random() * 40) + 60
    });
  }
  
  // Keep only last 30 days
  this.learningPatterns = this.learningPatterns
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30);
  
  // Update totals
  this.totalHoursLearned += hoursLearned;
  this.totalExercisesDone += exercisesDone;
  
  // Update streak
  this.updateStreak();
};

// Method to update streak
learningPerformanceSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.dayStreak += 1;
    this.maxStreak = Math.max(this.maxStreak, this.dayStreak);
  } else if (daysDiff > 1) {
    // Streak broken
    this.dayStreak = 1;
  }
  
  this.lastActiveDate = today;
  this.lastStreakDate = today;
};

module.exports = mongoose.model('LearningPerformance', learningPerformanceSchema);
