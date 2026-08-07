const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
// Field-for-field match against src/lib/data.js `services`:
//   { id, name, category, duration, priceFrom }
// Referenced by Salon.services (type: 'Salon'). Spa venues use their own
// embedded `packages` instead (see Salon model), matching BookAppointment.jsx
// where isSpa ? venue.packages : services.filter(...).
// ---------------------------------------------------------------------------

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
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
    category: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required, e.g. "30 min"'],
      trim: true,
    },
    priceFrom: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

serviceSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
