const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  
  passwordHash: {
    type: String,
    select: false // Hidden by default
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // OAuth providers
  oauthProviders: [{
    type: String,
    enum: ['google', 'github']
  }],
  
  // OAuth IDs
  googleId: String,
  githubId: String,
  githubUsername: String
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ githubId: 1 }, { sparse: true });

// Pre-save middleware to hash passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Add OAuth provider method
userSchema.methods.addOAuthProvider = function(provider, providerData = {}) {
  if (!this.oauthProviders.includes(provider)) {
    this.oauthProviders.push(provider);
  }
  
  // Store provider-specific data
  if (provider === 'google' && providerData.googleId) {
    this.googleId = providerData.googleId;
  }
  
  if (provider === 'github') {
    if (providerData.githubId) this.githubId = providerData.githubId;
    if (providerData.username) this.githubUsername = providerData.username;
  }
  
  this.isVerified = true; // OAuth providers verify emails
  return this.save();
};

// Find user by OAuth provider
userSchema.statics.findByOAuth = function(provider, providerId) {
  const query = {};
  if (provider === 'google') query.googleId = providerId;
  if (provider === 'github') query.githubId = providerId;
  return this.findOne(query);
};

// Find or create OAuth user
userSchema.statics.findOrCreateOAuth = async function(provider, profile, email) {
  // Try to find by provider ID
  let user = await this.findByOAuth(provider, profile.id);
  if (user) return user;
  
  // Try to find by email
  user = await this.findOne({ email: email.toLowerCase() });
  
  if (user) {
    // Link OAuth to existing user
    const providerData = { [`${provider}Id`]: profile.id };
    if (provider === 'github') providerData.username = profile.username;
    
    await user.addOAuthProvider(provider, providerData);
    return user;
  }
  
  // Create new user
  const userData = {
    email: email.toLowerCase(),
    name: profile.displayName || profile.username || 'User',
    isVerified: true,
    oauthProviders: [provider]
  };
  
  if (provider === 'google') userData.googleId = profile.id;
  if (provider === 'github') {
    userData.githubId = profile.id;
    userData.githubUsername = profile.username;
  }
  
  return this.create(userData);
};

module.exports = mongoose.model('User', userSchema);