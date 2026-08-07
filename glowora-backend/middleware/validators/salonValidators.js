const { body, validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

const createSalonRules = [
  body('name').trim().notEmpty().withMessage('Venue name is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('type').optional().isIn(['Salon', 'Spa']).withMessage('Type must be Salon or Spa'),
  runValidation,
];

const bookAppointmentRules = [
  body('salonId').trim().notEmpty().withMessage('A valid salonId is required'),
  body('offeringName').trim().notEmpty().withMessage('A service/package name is required'),
  body('staffName').trim().notEmpty().withMessage('A staff member is required'),
  body('bookingDate').isISO8601().withMessage('A valid bookingDate (YYYY-MM-DD) is required'),
  body('bookingTime').trim().notEmpty().withMessage('A booking time is required'),
  body('paymentMethod').isIn(['card', 'netbanking', 'upi', 'cod']).withMessage('Invalid payment method'),
  runValidation,
];

module.exports = { createSalonRules, bookAppointmentRules };
