const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
// Field-for-field match against src/lib/data.js `makeProduct()` output, which
// is what ProductListing.jsx, ProductDetails.jsx and the ProductCard
// component all render. Keep this in sync with that shape — it is the
// contract the frontend will bind to once Module 2 is wired in.
//
// Filters this schema/index set must support (ProductListing.jsx state):
//   selectedCats, selectedBrands, priceRange (max), minRating, proOnly,
//   inStockOnly, discountOnly (>=10%), featuredOnly, bestsellerOnly,
//   newArrivalOnly, sort (relevance|price-asc|price-desc|rating|discount)
// ---------------------------------------------------------------------------

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    professionalOnly: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      trim: true,
      default: '1 unit',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    moq: {
      type: Number,
      default: 1,
      min: 1,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    tags: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    img: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    isAnimated: {
      type: Boolean,
      default: false,
    },
    benefits: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: String,
      trim: true,
      default: '',
    },
    usage: {
      type: String,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// Slug + discount auto-derive so admin forms only need to send name/price/mrp.
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = `${this.name}-${Date.now()}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.mrp > 0 && this.price <= this.mrp) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

// Virtual — ProductListing.jsx's `inStockOnly` filter and ProductDetails.jsx's
// "Out of stock" badge both read a boolean, not the raw stock count.
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes supporting the filter/sort/search combinations above.
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1, rating: 1 });
productSchema.index({ featured: 1, bestseller: 1, newArrival: 1 });

module.exports = mongoose.model('Product', productSchema);
