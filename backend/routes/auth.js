const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// ---------- EMAIL VERIFICATION ----------
router.post('/send-code', authController.sendCode);
router.post('/verify', authController.verifyCode);
router.post('/check-email', authController.checkEmail);

// ---------- AUTHENTICATION ----------
router.post('/register', authController.register);
router.post('/login', authController.login);

// ---------- PROTECTED ROUTES ----------
router.get('/me', verifyToken, authController.me);


// ---------- OAUTH (manual) ----------
// Google
router.get('/google', authController.oauthGoogleStart);
router.get('/google/callback', authController.oauthGoogleCallback);

// GitHub
router.get('/github', authController.oauthGithubStart);
router.get('/github/callback', authController.oauthGithubCallback);

module.exports = router;
