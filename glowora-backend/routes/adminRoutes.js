const express = require('express');
const router = express.Router();

const { getDashboardStats, getCustomers, getUsers, updateUserStatus, seedDatabase, getAllAppointments } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Base path: /api/admin (see server.js) - admin/Dashboard.jsx, AdminCustomers.jsx.
router.use(protect, authorize('Admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.post('/seed', seedDatabase);
router.get('/appointments', getAllAppointments);

module.exports = router;
