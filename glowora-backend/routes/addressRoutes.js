const express = require('express');
const router = express.Router();

const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');
const { addressRules } = require('../middleware/validators/addressValidators');

// Base path: /api/addresses (see server.js) — Profile.jsx address management.
router.use(protect);

router.get('/', getAddresses);
router.post('/', addressRules, addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
