const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleLogin,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
  googleLoginRules,
} = require('../middleware/validators/authValidators');

// ---------------------------------------------------------------------------
// Base path: /api/auth  (see server.js)
//
// POST /api/auth/register        — matches AuthContext.jsx register()
// POST /api/auth/login           — matches AuthContext.jsx login()
// GET  /api/auth/me              — current session (protected)
// POST /api/auth/forgot-password — ForgotPassword.jsx (OTP request)
// POST /api/auth/verify-otp      — ForgotPassword.jsx (OTP verify step)
// POST /api/auth/reset-password  — ForgotPassword.jsx (final reset step)
// POST /api/auth/google          — Google Login button (Firebase token)
// ---------------------------------------------------------------------------

router.post('/register', registerRules, registerUser);
router.post('/login', loginRules, loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordRules, forgotPassword);
router.post('/verify-otp', verifyOtpRules, verifyOtp);
router.post('/reset-password', resetPasswordRules, resetPassword);
router.post('/google', googleLoginRules, googleLogin);

module.exports = router;
