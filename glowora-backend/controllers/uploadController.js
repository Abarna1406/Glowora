const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// ---------------------------------------------------------------------------
// Shared by Products, Salons, Spas and profile-image uploads. Returns a flat
// array of hosted URLs the caller then saves onto the relevant document
// (e.g. Product.img / Product.gallery, Salon.images, User.profileImage).
// ---------------------------------------------------------------------------

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `glowora/${folder}` }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });

const saveBufferLocally = (buffer, originalname) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
};

// @desc    Upload one or more images (field name: "images")
// @route   POST /api/upload
// @access  Private
const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files && req.files.length ? req.files : req.file ? [req.file] : [];

  if (!files.length) {
    res.status(400);
    throw new Error('No image file(s) provided');
  }

  const folder = req.body.folder || 'misc';

  const urls = await Promise.all(
    files.map((file) =>
      isCloudinaryConfigured ? uploadBufferToCloudinary(file.buffer, folder) : Promise.resolve(saveBufferLocally(file.buffer, file.originalname)),
    ),
  );

  res.status(200).json({
    success: true,
    message: 'Image(s) uploaded successfully',
    data: { urls },
  });
});

module.exports = { uploadImages };
