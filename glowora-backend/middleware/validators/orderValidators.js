const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

// Matches Checkout.jsx's delivery/payment selectors.
const createOrderRules = [
  body('deliveryMethod').optional().isIn(['standard', 'priority']).withMessage('Invalid delivery method'),
  body('paymentMethod').isIn(['card', 'netbanking', 'upi', 'cod']).withMessage('Invalid payment method'),
  runValidation,
];

const updateStatusRules = [
  body('status').isIn(['Processing', 'In Transit', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
  runValidation,
];

module.exports = { createOrderRules, updateStatusRules };
