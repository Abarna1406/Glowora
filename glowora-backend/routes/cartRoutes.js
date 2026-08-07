const express = require('express');
const router = express.Router();

const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { addToCartRules, updateCartItemRules } = require('../middleware/validators/cartValidators');

// Base path: /api/cart (see server.js) — every route requires a logged-in user.
router.use(protect);

router.get('/', getCart);
router.post('/', addToCartRules, addToCart);
router.delete('/', clearCart);
router.put('/:productId', updateCartItemRules, updateCartItem);
router.delete('/:productId', removeFromCart);

module.exports = router;
