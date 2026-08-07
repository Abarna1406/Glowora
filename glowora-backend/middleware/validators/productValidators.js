const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

// Matches the fields AdminProducts.jsx's table (and the eventual "Add
// product" form) needs: name, sku, category, price, stock at minimum.
const createProductRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').isMongoId().withMessage('A valid category id is required'),
  body('brand').isMongoId().withMessage('A valid brand id is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('mrp').isFloat({ min: 0 }).withMessage('MRP must be a non-negative number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  runValidation,
];

module.exports = { createProductRules };
