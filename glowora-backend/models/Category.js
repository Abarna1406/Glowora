const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
// Mirrors src/lib/data.js `categories` entries: { id, name, code, blurb, img }.
// `count` (products in this category) is NOT stored here — it's derived at
// query time in categoryController so it never goes stale as products are
// added/removed/deactivated.
// ---------------------------------------------------------------------------

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'A short category code is required'],
      trim: true,
      uppercase: true,
    },
    blurb: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
