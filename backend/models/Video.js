const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  channel: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: "Unknown"
  },
  description: {
    type: String,
    default: ""
  },
  publishedAt: {
    type: Date
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: "Education"
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Static method to find or create video
videoSchema.statics.findOrCreate = async function(videoData) {
  let video = await this.findOne({ videoId: videoData.videoId });
  
  if (!video) {
    video = new this(videoData);
    await video.save();
  } else {
    // Update existing video with new data
    Object.assign(video, videoData);
    await video.save();
  }
  
  return video;
};


module.exports = mongoose.model('Video', videoSchema);
