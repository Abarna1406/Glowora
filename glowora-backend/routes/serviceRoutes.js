const express = require('express');
const router = express.Router();

const { getServices, getTimeSlots, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Base path: /api/services (see server.js) — Services.jsx, BookAppointment.jsx.
router.get('/time-slots', getTimeSlots); // before /:id-style routes — there are none here, but kept explicit for clarity
router.get('/', getServices);
router.post('/', protect, authorize('Admin'), createService);
router.put('/:id', protect, authorize('Admin'), updateService);
router.delete('/:id', protect, authorize('Admin'), deleteService);

module.exports = router;
