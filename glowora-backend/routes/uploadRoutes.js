const express = require('express');
const router = express.Router();

const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/upload — multipart/form-data, field name "images" (up to 6 files)
router.post('/', protect, upload.array('images', 6), uploadImages);

module.exports = router;
