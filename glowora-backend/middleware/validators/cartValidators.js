const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

const addToCartRules = [
  body('productId').isMongoId().withMessage('A valid productId is required'),
  body('qty').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  runValidation,
];

const updateCartItemRules = [
  body('qty').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  runValidation,
];

module.exports = { addToCartRules, updateCartItemRules };
