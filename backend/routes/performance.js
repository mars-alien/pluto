const express = require('express');
const router = express.Router();
const LearningPerformance = require('../models/LearningPerformance');
const { verifyToken } = require('../middleware/auth');

// Get user's learning performance data
router.get('/', verifyToken, async (req, res) => {
  try {
    const performance = await LearningPerformance.getOrCreate(req.userId);
    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Server error while fetching performance data' });
  }
});

// Update daily activity
router.post('/activity', verifyToken, async (req, res) => {
  try {
    const { hoursLearned = 0, exercisesDone = 0, videosWatched = 0 } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    performance.updateDailyActivity(hoursLearned, exercisesDone, videosWatched);
    
    await performance.save();
    res.json({ message: 'Activity updated successfully', performance });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
});

// Update skill progress
router.post('/skills/:skillName', verifyToken, async (req, res) => {
  try {
    const { skillName } = req.params;
    const { level, exercisesCompleted, firstAttemptSuccess, totalAttempts, averageScore } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    const skillIndex = performance.skillsProgress.findIndex(s => s.skill.toLowerCase() === skillName.toLowerCase());
    
    if (skillIndex >= 0) {
      // Update existing skill
      const skill = performance.skillsProgress[skillIndex];
      if (level !== undefined) skill.level = level;
      if (exercisesCompleted !== undefined) skill.exercisesCompleted = exercisesCompleted;
      if (firstAttemptSuccess !== undefined) skill.firstAttemptSuccess = firstAttemptSuccess;
      if (totalAttempts !== undefined) skill.totalAttempts = totalAttempts;
      if (averageScore !== undefined) skill.averageScore = averageScore;
      skill.lastUpdated = new Date();
    } else {
      // Add new skill
      performance.skillsProgress.push({
        skill: skillName,
        level: level || 0,
        exercisesCompleted: exercisesCompleted || 0,
        firstAttemptSuccess: firstAttemptSuccess || 0,
        totalAttempts: totalAttempts || 0,
        averageScore: averageScore || 0
      });
    }
    
    await performance.save();
    res.json({ message: 'Skill progress updated successfully', performance });
  } catch (error) {
    console.error('Error updating skill progress:', error);
    res.status(500).json({ message: 'Server error while updating skill progress' });
  }
});

// Add achievement
router.post('/achievements', verifyToken, async (req, res) => {
  try {
    const { id, name, description, badge, category } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    // Check if achievement already exists
    const existingAchievement = performance.achievements.find(a => a.id === id);
    if (existingAchievement) {
      return res.status(400).json({ message: 'Achievement already earned' });
    }
    
    performance.achievements.push({
      id,
      name,
      description,
      badge,
      category,
      earnedAt: new Date()
    });
    
    await performance.save();
    res.json({ message: 'Achievement added successfully', performance });
  } catch (error) {
    console.error('Error adding achievement:', error);
    res.status(500).json({ message: 'Server error while adding achievement' });
  }
});

// Update course progress
router.post('/courses/:courseName', verifyToken, async (req, res) => {
  try {
    const { courseName } = req.params;
    const { progress, hoursSpent } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    const courseIndex = performance.activeCourses.findIndex(c => c.name.toLowerCase() === courseName.toLowerCase());
    
    if (courseIndex >= 0) {
      // Update existing course
      const course = performance.activeCourses[courseIndex];
      if (progress !== undefined) course.progress = progress;
      if (hoursSpent !== undefined) course.hoursSpent = hoursSpent;
      course.lastAccessed = new Date();
    } else {
      // Add new course
      performance.activeCourses.push({
        name: courseName,
        progress: progress || 0,
        hoursSpent: hoursSpent || 0,
        lastAccessed: new Date()
      });
    }
    
    await performance.save();
    res.json({ message: 'Course progress updated successfully', performance });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Server error while updating course progress' });
  }
});

// Update quiz performance
router.post('/quiz', verifyToken, async (req, res) => {
  try {
    const { score } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    // Update quiz statistics
    const totalScore = (performance.averageQuizScore * performance.totalQuizzesTaken) + score;
    performance.totalQuizzesTaken += 1;
    performance.averageQuizScore = Math.round(totalScore / performance.totalQuizzesTaken);
    
    await performance.save();
    res.json({ message: 'Quiz performance updated successfully', performance });
  } catch (error) {
    console.error('Error updating quiz performance:', error);
    res.status(500).json({ message: 'Server error while updating quiz performance' });
  }
});

// Update project completion
router.post('/projects', verifyToken, async (req, res) => {
  try {
    const { completed = false } = req.body;
    
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    if (completed) {
      performance.projectsCompleted += 1;
      if (performance.projectsInProgress > 0) {
        performance.projectsInProgress -= 1;
      }
    } else {
      performance.projectsInProgress += 1;
    }
    
    await performance.save();
    res.json({ message: 'Project status updated successfully', performance });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Server error while updating project status' });
  }
});

// Get performance summary
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const performance = await LearningPerformance.getOrCreate(req.userId);
    
    const summary = {
      dayStreak: performance.dayStreak,
      totalHoursLearned: performance.totalHoursLearned,
      totalExercisesDone: performance.totalExercisesDone,
      exerciseSuccessRate: performance.exerciseSuccessRate,
      activeCourses: performance.activeCourses.length,
      achievementsCount: performance.achievements.length,
      averageQuizScore: performance.averageQuizScore,
      projectsCompleted: performance.projectsCompleted
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching performance summary:', error);
    res.status(500).json({ message: 'Server error while fetching performance summary' });
  }
});

module.exports = router;
