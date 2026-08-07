const express = require('express');
const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { categoryRules } = require('../middleware/validators/catalogValidators');

// Base path: /api/categories (see server.js)
// Powers Categories.jsx (public list) and AdminCategories.jsx (admin CRUD).

router.get('/', getCategories);
router.get('/:idOrSlug', getCategory);
router.post('/', protect, authorize('Admin'), categoryRules, createCategory);
router.put('/:id', protect, authorize('Admin'), updateCategory);
router.delete('/:id', protect, authorize('Admin'), deleteCategory);

module.exports = router;
