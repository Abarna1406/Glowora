const express = require('express');
const router = express.Router();

const { bookAppointment, getMyAppointments, getAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { bookAppointmentRules } = require('../middleware/validators/salonValidators');

// Base path: /api/appointments (see server.js) - BookAppointment.jsx, Appointments.jsx.
router.use(protect);

router.post('/', bookAppointmentRules, bookAppointment);
router.get('/', getMyAppointments);
router.get('/:id', getAppointment);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
