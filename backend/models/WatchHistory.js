const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
    index: true
  },
  videoId: {
    type: String,
    required: true,
    index: true
  },
  watchedSeconds: {
    type: Number,
    default: 0
  },
  totalSeconds: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  watchCount: {
    type: Number,
    default: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for performance
watchHistorySchema.index({ user: 1, lastWatchedAt: -1 });
watchHistorySchema.index({ user: 1, videoId: 1 }, { unique: true });
watchHistorySchema.index({ user: 1, completed: 1 });
watchHistorySchema.index({ user: 1, bookmarked: 1 });

// Pre-save middleware to calculate progress percentage
watchHistorySchema.pre('save', function(next) {
  if (this.totalSeconds > 0) {
    this.progressPercentage = Math.round((this.watchedSeconds / this.totalSeconds) * 100);
    this.completed = this.progressPercentage >= 95;
  }
  next();
});

// Static method to find or update watch history
watchHistorySchema.statics.findOrCreate = async function(userId, videoId, videoData = {}) {
  let watchHistory = await this.findOne({ user: userId, videoId });
  
  if (!watchHistory) {
    // Find or create the video
    const Video = mongoose.model('Video');
    const video = await Video.findOrCreate({
      videoId,
      ...videoData
    });
    
    watchHistory = new this({
      user: userId,
      video: video._id,
      videoId,
      lastWatchedAt: new Date()
    });
    await watchHistory.save();
  } else {
    // Update existing record
    watchHistory.lastWatchedAt = new Date();
    watchHistory.watchCount += 1;
    await watchHistory.save();
  }
  
  return watchHistory;
};

// Static method to update watch progress
watchHistorySchema.statics.updateProgress = async function(userId, videoId, watchedSeconds, totalSeconds = null) {
  const watchHistory = await this.findOne({ user: userId, videoId });
  
  if (watchHistory) {
    watchHistory.watchedSeconds = watchedSeconds;
    if (totalSeconds) {
      watchHistory.totalSeconds = totalSeconds;
    }
    watchHistory.lastWatchedAt = new Date();
    await watchHistory.save();
  }
  
  return watchHistory;
};

// Static method to get user's watch history
watchHistorySchema.statics.getUserHistory = async function(userId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  return await this.find({ user: userId })
    .populate('video', 'title channel thumbnail duration')
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get user's bookmarked videos
watchHistorySchema.statics.getBookmarkedVideos = async function(userId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  return await this.find({ user: userId, bookmarked: true })
    .populate('video', 'title channel thumbnail duration')
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get user's completed videos
watchHistorySchema.statics.getCompletedVideos = async function(userId, limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  return await this.find({ user: userId, completed: true })
    .populate('video', 'title channel thumbnail duration')
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
