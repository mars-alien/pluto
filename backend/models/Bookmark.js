const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
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
  bookmarkedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ""
  },
  tags: [{
    type: String,
    trim: true
  }],
  folder: {
    type: String,
    default: "General",
    trim: true
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
bookmarkSchema.index({ user: 1, bookmarkedAt: -1 });
bookmarkSchema.index({ user: 1, videoId: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, folder: 1 });

// Static method to add bookmark
bookmarkSchema.statics.addBookmark = async function(userId, videoId, videoData = {}) {
  // Check if already bookmarked
  const existingBookmark = await this.findOne({ user: userId, videoId });
  if (existingBookmark) {
    return existingBookmark;
  }

  // Find or create the video
  const Video = mongoose.model('Video');
  const video = await Video.findOrCreate({
    videoId,
    ...videoData
  });
  
  const bookmark = new this({
    user: userId,
    video: video._id,
    videoId,
    bookmarkedAt: new Date()
  });
  
  await bookmark.save();
  return bookmark;
};

// Static method to remove bookmark
bookmarkSchema.statics.removeBookmark = async function(userId, videoId) {
  return await this.findOneAndDelete({ user: userId, videoId });
};

// Static method to get user's bookmarks
bookmarkSchema.statics.getUserBookmarks = async function(userId, limit = 20, page = 1, folder = null) {
  const skip = (page - 1) * limit;
  const query = { user: userId };
  
  if (folder && folder !== 'all') {
    query.folder = folder;
  }
  
  return await this.find(query)
    .populate('video', 'title channel thumbnail duration tags')
    .sort({ bookmarkedAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to check if video is bookmarked
bookmarkSchema.statics.isBookmarked = async function(userId, videoId) {
  const bookmark = await this.findOne({ user: userId, videoId });
  return !!bookmark;
};

// Static method to get bookmark folders
bookmarkSchema.statics.getUserFolders = async function(userId) {
  return await this.distinct('folder', { user: userId });
};

module.exports = mongoose.model('Bookmark', bookmarkSchema);
