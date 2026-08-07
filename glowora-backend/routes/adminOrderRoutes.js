const express = require('express');
const router = express.Router();

const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { updateStatusRules } = require('../middleware/validators/orderValidators');

// Base path: /api/admin/orders (see server.js) — AdminOrders.jsx.
router.use(protect, authorize('Admin'));

router.get('/', getAllOrders);
router.put('/:id/status', updateStatusRules, updateOrderStatus);

module.exports = router;
