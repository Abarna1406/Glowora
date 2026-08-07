const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

const createReviewRules = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
  runValidation,
];

const moderateReviewRules = [
  body('status').isIn(['approved', 'rejected']).withMessage("Status must be 'approved' or 'rejected'"),
  runValidation,
];

module.exports = { createReviewRules, moderateReviewRules };
