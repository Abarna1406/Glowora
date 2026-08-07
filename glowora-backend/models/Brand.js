const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
// Mirrors src/lib/data.js `brands` entries: { id, name, tagline, origin,
// tier, logo, cover, story }. `products` (SKU count) is derived at query
// time in brandController, same reasoning as Category.count.
// ---------------------------------------------------------------------------

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
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
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    origin: {
      type: String,
      trim: true,
      default: '',
    },
    tier: {
      type: String,
      enum: ['Platinum Partner', 'Gold Partner', 'Silver Partner'],
      default: 'Silver Partner',
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    story: {
      type: String,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

brandSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
