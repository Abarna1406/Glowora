const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

// Matches Category fields shown in AdminCategories.jsx (name, code, image).
const categoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('code').trim().notEmpty().withMessage('Category code is required'),
  runValidation,
];

// Matches Brand fields shown in AdminBrands.jsx (name, tier, logo).
const brandRules = [
  body('name').trim().notEmpty().withMessage('Brand name is required'),
  body('tier')
    .optional()
    .isIn(['Platinum Partner', 'Gold Partner', 'Silver Partner'])
    .withMessage('Invalid brand tier'),
  runValidation,
];

module.exports = { categoryRules, brandRules };
