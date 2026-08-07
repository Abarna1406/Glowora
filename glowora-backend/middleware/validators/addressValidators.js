const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

// Matches Checkout.jsx Step 1's address form fields.
const addressRules = [
  body('businessName').trim().notEmpty().withMessage('Business / salon name is required'),
  body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pinCode').trim().notEmpty().withMessage('PIN code is required'),
  runValidation,
];

module.exports = { addressRules };
