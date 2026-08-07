const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------------
// generateToken — signs a JWT carrying the user's id and role.
// Consumed by src/lib/api.js's request interceptor, which attaches it as
// `Authorization: Bearer <token>` on every outgoing request, and read back
// by middleware/authMiddleware.js on protected routes.
// ---------------------------------------------------------------------------
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
