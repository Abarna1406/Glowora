const cloudinary = require('cloudinary').v2;

// ---------------------------------------------------------------------------
// cloudinary — configured once from env vars. If unconfigured, uploadRoutes
// falls back to local disk storage under /uploads (see middleware/upload.js)
// so the API still works out of the box in development.
// ---------------------------------------------------------------------------
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

module.exports = { cloudinary, isCloudinaryConfigured: isConfigured };
