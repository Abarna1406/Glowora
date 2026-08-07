const express = require('express');
const router = express.Router();

const { getAllReviews, moderateReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { moderateReviewRules } = require('../middleware/validators/reviewValidators');

// Base path: /api/admin/reviews (see server.js) — AdminReviews.jsx moderation queue.
router.use(protect, authorize('Admin'));

router.get('/', getAllReviews);
router.patch('/:id', moderateReviewRules, moderateReview);
router.delete('/:id', deleteReview);

module.exports = router;
