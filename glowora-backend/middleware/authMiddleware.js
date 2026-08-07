const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ---------------------------------------------------------------------------
// protect — verifies the Bearer token attached by src/lib/api.js's request
// interceptor. On success, attaches the full user document (minus password)
// to req.user for downstream controllers.
//
// On failure (missing/invalid/expired token) this responds 401. The
// frontend's response interceptor (src/lib/api.js) already handles a 401 by
// clearing localStorage — no special payload shape is required beyond the
// standard { success: false, message } from errorMiddleware.
// ---------------------------------------------------------------------------
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }
  if (!user.active) {
    res.status(401);
    throw new Error('This account has been deactivated');
  }

  req.user = user;
  next();
});

// ---------------------------------------------------------------------------
// authorize(...roles) — restricts a route to specific User.role values.
// Usage: router.get('/admin-only', protect, authorize('Admin'), handler)
// ---------------------------------------------------------------------------
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role}' is not authorized to access this resource`);
    }
    next();
  };
};

module.exports = { protect, authorize };
