const express = require('express');
const router = express.Router();

const { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// Base path: /api/wishlist (see server.js) — every route requires a logged-in user.
router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.post('/:productId/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
