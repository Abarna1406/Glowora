const multer = require('multer');

// ---------------------------------------------------------------------------
// upload — Multer configured with in-memory storage. uploadController decides
// per-request whether to stream the buffer to Cloudinary or write it to the
// local /uploads folder, depending on whether Cloudinary env vars are set.
// ---------------------------------------------------------------------------
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP and GIF images are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter,
});

module.exports = upload;
