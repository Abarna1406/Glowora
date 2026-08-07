const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders, getOrder, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { createOrderRules } = require('../middleware/validators/orderValidators');

// Base path: /api/orders (see server.js) — Checkout.jsx "Place order", Orders.jsx history.
router.use(protect);

router.post('/', createOrderRules, createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
