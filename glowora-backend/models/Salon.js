const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Salon
// ---------------------------------------------------------------------------
// src/lib/data.js keeps `salons` and `spas` as two arrays with almost
// identical shape, distinguished only by `type: 'Salon' | 'Spa'` - the same
// pattern SalonProfile.jsx/SpaProfile.jsx/BookAppointment.jsx rely on
// (`venue.type === 'Spa'`). One collection here, filtered by `type` in the
// controller, keeps that exact contract without duplicating the schema.
//
// Salon-type venues sell a la carte `services` (ref Service, global
// catalog). Spa-type venues sell their own bundled `packages` - this
// mirrors BookAppointment.jsx's branch:
//   isSpa ? venue.packages.map(...) : services.filter(s => venue.serviceIds...)
//
// `bookedSlots` is intentionally NOT stored here as a static field (unlike
// the mock data) - real availability must be date-specific, so it's
// computed on demand in salonController.getAvailability from the
// Appointment collection instead.
// ---------------------------------------------------------------------------

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: false },
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Salon', 'Spa'],
      required: true,
    },
    city: { type: String, required: [true, 'City is required'], trim: true },
    area: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    coverImage: { type: String, default: '' },
    logo: { type: String, trim: true, default: '' },
    gallery: { type: [String], default: [] },
    videoUrl: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    openingHours: { type: String, trim: true, default: 'Mon-Sun . 9:00 AM - 8:30 PM' },
    // Matches lib/data.js's priceRange values exactly ('\u20B9' x1-4).
    priceRange: {
      type: String,
      enum: ['\u20B9', '\u20B9\u20B9', '\u20B9\u20B9\u20B9', '\u20B9\u20B9\u20B9\u20B9'],
      default: '\u20B9\u20B9',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    // Salon-type only:
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    // Spa-type only:
    packages: { type: [packageSchema], default: [] },
    staff: { type: [staffSchema], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

salonSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = `${this.name}-${Date.now()}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

salonSchema.index({ type: 1, city: 1 });

module.exports = mongoose.model('Salon', salonSchema);
