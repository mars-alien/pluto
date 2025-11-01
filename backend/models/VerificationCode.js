const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  code: {
    type: String,
    required: true,
    length: 6
  },
  
  type: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    default: 'email_verification'
  },
  
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  
  expiresAt: {
    type: Date,
    required: true
  },
  
  used: {
    type: Boolean,
    default: false
  },
  
  usedAt: Date
}, {
  timestamps: true
});

// Compound indexes
verificationCodeSchema.index({ email: 1, type: 1 });
verificationCodeSchema.index({ expiresAt: 1 });

// Check if code is valid
verificationCodeSchema.methods.isValid = function() {
  return !this.used && 
         this.attempts < 3 && 
         this.expiresAt > new Date();
};

// Mark code as used
verificationCodeSchema.methods.markAsUsed = function() {
  this.used = true;
  this.usedAt = new Date();
  return this.save();
};

// Increment attempts
verificationCodeSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Create verification code
verificationCodeSchema.statics.createCode = async function(email, type = 'email_verification', ttlMinutes = 15) {
  // Remove existing codes
  await this.deleteMany({ email: email.toLowerCase(), type });
  
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);
  
  return this.create({
    email: email.toLowerCase(),
    code,
    type,
    expiresAt
  });
};

// Verify code
verificationCodeSchema.statics.verifyCode = async function(email, code, type = 'email_verification') {
  const record = await this.findOne({
    email: email.toLowerCase(),
    code,
    type
  });
  
  if (!record) {
    return { success: false, message: 'Invalid verification code' };
  }
  
  if (!record.isValid()) {
    if (record.used) {
      return { success: false, message: 'Code already used' };
    }
    if (record.attempts >= 3) {
      return { success: false, message: 'Too many failed attempts' };
    }
    if (record.expiresAt <= new Date()) {
      return { success: false, message: 'Code expired' };
    }
  }
  
  // Mark as used and cleanup
  await record.markAsUsed();
  await this.deleteMany({ email: email.toLowerCase(), type });
  
  return { success: true, message: 'Code verified successfully' };
};

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
