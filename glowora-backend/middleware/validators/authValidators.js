const { body, validationResult } = require('express-validator');

// ---------------------------------------------------------------------------
// runValidation — collects express-validator errors and forwards a single
// 400 with the first message, keeping the error shape identical to every
// other error in the app: { success: false, message }.
// ---------------------------------------------------------------------------
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

// Matches Register.jsx's form fields + roleOptions (Salon | Spa | Beautician).
// Admin accounts are never created through this public endpoint.
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['Salon', 'Spa', 'Beautician'])
    .withMessage('Role must be Salon, Spa or Beautician'),
  runValidation,
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  runValidation,
];

const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  runValidation,
];

const verifyOtpRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  runValidation,
];

const resetPasswordRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  runValidation,
];

const googleLoginRules = [
  body('idToken').notEmpty().withMessage('Google idToken is required'),
  runValidation,
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
  googleLoginRules,
};
