const express = require('express');
const router = express.Router();

const {
  getSalons,
  getSpas,
  getVenue,
  getAvailability,
  createSalon,
  updateSalon,
  deleteSalon,
  getMyVenue,
  getMyEarnings,
  getMyCustomers,
} = require('../controllers/salonController');
const { getSalonAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createSalonRules } = require('../middleware/validators/salonValidators');

// Base path: /api/salons (see server.js). /api/spas is mounted separately
// onto the same controller's getSpas - see routes/spaRoutes.js.

// -- Owner dashboard (Salon Dashboard) - MUST precede /:idOrSlug -----------
router.get('/me/venue', protect, authorize('Salon', 'Spa'), getMyVenue);
router.get('/me/earnings', protect, authorize('Salon', 'Spa'), getMyEarnings);
router.get('/me/customers', protect, authorize('Salon', 'Spa'), getMyCustomers);
router.get('/me/appointments', protect, authorize('Salon', 'Spa'), getSalonAppointments);
router.put('/me/appointments/:id/status', protect, authorize('Salon', 'Spa'), updateAppointmentStatus);

// -- Public listings ---------------------------------------------------------
router.get('/', getSalons);
router.post('/', protect, authorize('Salon', 'Spa', 'Admin'), createSalonRules, createSalon);

router.get('/:id/availability', getAvailability);
router.put('/:id', protect, authorize('Salon', 'Spa', 'Admin'), updateSalon);
router.delete('/:id', protect, authorize('Salon', 'Spa', 'Admin'), deleteSalon);

// Catch-all id/slug lookup - MUST be last.
router.get('/:idOrSlug', getVenue);

module.exports = router;
