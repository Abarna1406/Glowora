const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const User = require('../models/User');
const Service = require('../models/Service');
const Salon = require('../models/Salon');

// ---------------------------------------------------------------------------
// Run with: node utils/seed.js
// Wipes and re-seeds Category/Brand/Product/User/Service/Salon so every
// module can be tested against real data immediately after `npm run dev`.
// ---------------------------------------------------------------------------
const run = async () => {
  await connectDB();

  await Promise.all([
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    Service.deleteMany({}),
    Salon.deleteMany({}),
  ]);

  const categories = await Category.insertMany([
    { name: 'Hair Care', code: 'HAIR', blurb: 'Shampoos, colour and treatments' },
    { name: 'Skin Care', code: 'SKIN', blurb: 'Facials, serums and clinical skincare' },
    { name: 'Spa & Body', code: 'SPA', blurb: 'Wraps, oils and body treatments' },
  ]);

  const brands = await Brand.insertMany([
    { name: 'Belline', tagline: 'Salon-grade colour science', origin: 'Italy', tier: 'Platinum Partner', logo: 'BL' },
    { name: 'Nord Botanics', tagline: 'Nordic clinical skincare', origin: 'Norway', tier: 'Gold Partner', logo: 'NB' },
  ]);

  await Product.insertMany([
    {
      name: 'Restorative Bond Shampoo',
      sku: 'GLW-1000',
      description: 'A bond-rebuilding professional shampoo for chemically treated hair.',
      brand: brands[0]._id,
      category: categories[0]._id,
      price: 1450,
      mrp: 1800,
      professionalOnly: true,
      unit: '1L',
      stock: 120,
      moq: 2,
      featured: true,
      bestseller: true,
      newArrival: false,
      tags: ['shampoo', 'bond repair'],
      benefits: ['Rebuilds internal bonds', 'Sulfate-free', 'Colour-safe'],
      ingredients: 'Aqua, Sodium Cocoyl Isethionate, Maleic Acid...',
      usage: 'Apply to wet hair, lather, leave for 2 minutes, rinse thoroughly.',
      img: '',
      gallery: [],
    },
    {
      name: 'Ammonia-Free Colour Crème',
      sku: 'GLW-1001',
      description: 'Full-coverage permanent colour without ammonia.',
      brand: brands[0]._id,
      category: categories[0]._id,
      price: 890,
      mrp: 950,
      professionalOnly: true,
      unit: '100ml',
      stock: 60,
      moq: 1,
      featured: false,
      bestseller: true,
      newArrival: false,
      tags: ['colour', 'ammonia-free'],
      benefits: ['100% grey coverage', 'No ammonia smell'],
      img: '',
      gallery: [],
    },
    {
      name: 'Thermal Clay Body Wrap',
      sku: 'GLW-2000',
      description: 'Detoxifying mineral clay wrap for spa body treatments.',
      brand: brands[1]._id,
      category: categories[2]._id,
      price: 2200,
      mrp: 2600,
      professionalOnly: false,
      unit: '1kg',
      stock: 0,
      moq: 1,
      featured: true,
      bestseller: false,
      newArrival: true,
      tags: ['body wrap', 'detox'],
      img: '',
      gallery: [],
    },
  ]);

  console.log('Seed complete: categories, brands, products created.');

  // -- Users (Admin + a Salon owner) -----------------------------------------
  const admin = await User.create({
    name: 'Glowora Admin',
    email: 'admin@glowora.com',
    password: 'admin123',
    role: 'Admin',
    isVerified: true,
  });

  const salonOwner = await User.create({
    name: 'Radhika Menon',
    email: 'radhika@lumenstudio.com',
    password: 'password123',
    role: 'Salon',
    phone: '+91 9800011122',
    isVerified: true,
  });

  // -- Services (global catalogue) -------------------------------------------
  const services = await Service.insertMany([
    { name: 'Hair Cut', category: 'Hair', duration: '30 min', priceFrom: 299 },
    { name: 'Hair Spa', category: 'Hair', duration: '45 min', priceFrom: 799 },
    { name: 'Facial', category: 'Skin', duration: '60 min', priceFrom: 999 },
    { name: 'Manicure', category: 'Nails', duration: '40 min', priceFrom: 499 },
  ]);

  // -- A sample Salon venue owned by the Salon user --------------------------
  await Salon.create({
    owner: salonOwner._id,
    name: 'Lumen Studio & Spa',
    type: 'Salon',
    city: 'Madurai',
    area: 'Anna Nagar',
    address: '12, Anna Nagar 2nd Ave, Madurai',
    phone: salonOwner.phone,
    email: 'hello@lumenstudio.glowora.com',
    description: 'Lumen Studio & Spa is a full-service salon in Madurai offering hair, skin, nail and grooming services.',
    priceRange: '\u20B9\u20B9\u20B9',
    services: services.map((s) => s._id),
    staff: [
      { name: 'Aarav Sharma', role: 'Senior Stylist', avatar: '' },
      { name: 'Kavya Iyer', role: 'Colour Specialist', avatar: '' },
    ],
  });

  console.log('Seed complete: users, services and a sample salon created.');
  console.log(`Admin login -> admin@glowora.com / admin123`);
  console.log(`Salon login -> radhika@lumenstudio.com / password123`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
