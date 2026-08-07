const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail, generateOtp } = require('../utils/sendEmail');
const getFirebaseAdmin = require('../utils/firebaseAdmin');

// ---------------------------------------------------------------------------
// Response shape reminder — src/context/AuthContext.jsx does:
//   const { data } = await api.post('/auth/login', ...)
//   const { token, user } = data.data
// So every auth success response below MUST be:
//   { success: true, message, data: { token, user } }
// ---------------------------------------------------------------------------

// @desc    Register a new professional account (Salon | Spa | Beautician)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'Beautician',
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { token, user: user.toSafeObject() },
  });
});

// @desc    Log in with email + password
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.active) {
    res.status(403);
    throw new Error('This account has been deactivated. Contact support.');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { token, user: user.toSafeObject() },
  });
});

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user fetched',
    data: { user: req.user.toSafeObject() },
  });
});

// @desc    Request a password-reset OTP by email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Do not reveal whether the email exists.
    res.status(200).json({
      success: true,
      message: 'If that email is registered, an OTP has been sent',
      data: null,
    });
    return;
  }

  const otp = generateOtp();
  user.otp = crypto.createHash('sha256').update(otp).digest('hex');
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your Glowora password reset OTP',
      html: `<p>Hello ${user.name},</p><p>Your OTP to reset your Glowora password is:</p><h2>${otp}</h2><p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
    });
  } catch (err) {
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Could not send OTP email. Please try again later.');
  }

  res.status(200).json({
    success: true,
    message: 'If that email is registered, an OTP has been sent',
    data: null,
  });
});

// @desc    Verify a password-reset OTP (without consuming it)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({
    email: email.toLowerCase(),
    otp: hashedOtp,
    otpExpire: { $gt: Date.now() },
  }).select('+otp +otpExpire');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified',
    data: null,
  });
});

// @desc    Reset password using a verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({
    email: email.toLowerCase(),
    otp: hashedOtp,
    otpExpire: { $gt: Date.now() },
  }).select('+otp +otpExpire +password');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.password = password;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: { token, user: user.toSafeObject() },
  });
});

// @desc    Log in / sign up via Google (Firebase ID token)
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const admin = getFirebaseAdmin();
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, email, name, picture } = decoded;

  if (!email) {
    res.status(400);
    throw new Error('Google account has no email associated');
  }

  let user = await User.findOne({ $or: [{ googleId: uid }, { email: email.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId: uid,
      profileImage: picture || '',
      role: 'Beautician',
      isVerified: true,
    });
  } else if (!user.googleId) {
    user.googleId = uid;
    if (!user.profileImage && picture) user.profileImage = picture;
    await user.save({ validateBeforeSave: false });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in with Google successfully',
    data: { token, user: user.toSafeObject() },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  googleLogin,
};
