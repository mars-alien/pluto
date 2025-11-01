const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/email');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET;
const CODE_TTL_MINUTES = parseInt(process.env.CODE_TTL_MINUTES || '15', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    oauthProviders: user.oauthProviders || [],
    createdAt: user.createdAt
  };
}
 
// Send verification code
exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
 
    const verificationRecord = await VerificationCode.createCode(email, 'email_verification', CODE_TTL_MINUTES);
    
    console.log(`Verification code for ${email}: ${verificationRecord.code}`);

    try {
      await sendVerificationEmail(email, verificationRecord.code);
    } catch (emailError) {
      console.error("Email sending failed, but code was generated:", emailError.message);
    }

    return res.json({ message: "Verification code sent" });
  } catch (err) {
    console.error('Send code error:', err);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code required" });
    }

    // Use VerificationCode model's static method
    const verification = await VerificationCode.verifyCode(email, code, 'email_verification');
    if (!verification.success) {
      return res.status(400).json({ message: verification.message });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = createToken(user);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Verify code error:', err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, code } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }

    // Server-side validation: require a name with at least 2 characters
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }
    if (code) {
      const verification = await VerificationCode.verifyCode(email, code, 'email_verification');
      if (!verification.success) {
        return res.status(400).json({ message: verification.message });
      }
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.passwordHash) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create or update user - DON'T manually hash password!
    const user = existingUser || new User({ email: email.toLowerCase() });
    user.name = name.trim();
    user.passwordHash = password; // Pre-save middleware will hash this
    user.isVerified = code ? true : false;

    await user.save(); // Pre-save middleware handles hashing

    const token = createToken(user);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    // If Mongoose validation fails, return a 400 with the validation message(s)
    if (err && err.name === 'ValidationError' && err.errors) {
      const details = Object.values(err.errors).map(e => e.message).join('; ');
      console.error('Register validation failed:', details);
      return res.status(400).json({ message: details });
    }

    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Use select('+passwordHash') to get password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Use User model's comparePassword method
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: formatUser(user) });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    return res.json({ 
      exists: !!user, 
      message: user ? "Email already registered" : "Email available" 
    });
  } catch (err) {
    console.error('Check email error:', err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth: start
exports.oauthGoogleStart = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const state = encodeURIComponent(req.query.action || 'login');
    const scope = encodeURIComponent('openid email profile');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
    return res.redirect(authUrl);
  } catch (err) {
    console.error('Google OAuth start error:', err);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// Google OAuth: callback
exports.oauthGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);

    const tokenResp = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const idToken = tokenResp.data.id_token;
    const accessToken = tokenResp.data.access_token;

    // Fetch user info
    const userinfoResp = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profile = userinfoResp.data; // {sub, email, name, picture, ...}

    const email = (profile.email || '').toLowerCase();
    const fakeProfile = { id: profile.sub, displayName: profile.name };
    const user = await User.findOrCreateOAuth('google', fakeProfile, email);
    const token = createToken(user);

    return res.redirect(`${FRONTEND_URL}/?oauth=callback&token=${token}`);
  } catch (err) {
    console.error('Google OAuth callback error:', err?.response?.data || err.message);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// GitHub OAuth: start
exports.oauthGithubStart = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const state = encodeURIComponent(req.query.action || 'login');
    const scope = encodeURIComponent('read:user user:email');

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    return res.redirect(authUrl);
  } catch (err) {
    console.error('GitHub OAuth start error:', err);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// GitHub OAuth: callback
exports.oauthGithubCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);

    // Exchange code for token
    const tokenResp = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResp.data.access_token;
    if (!accessToken) throw new Error('No access token from GitHub');

    // Fetch user profile
    const profileResp = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'OAuth App' }
    });
    const emailsResp = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'OAuth App' }
    });

    const primaryEmailObj = (emailsResp.data || []).find(e => e.primary) || emailsResp.data?.[0];
    const email = (primaryEmailObj?.email || `${profileResp.data.login}@github.local`).toLowerCase();

    const fakeProfile = { id: String(profileResp.data.id), username: profileResp.data.login };
    const user = await User.findOrCreateOAuth('github', fakeProfile, email);
    const token = createToken(user);

    return res.redirect(`${FRONTEND_URL}/?oauth=callback&token=${token}`);
  } catch (err) {
    console.error('GitHub OAuth callback error:', err?.response?.data || err.message);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
};
