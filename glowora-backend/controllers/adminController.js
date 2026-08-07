const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Service = require('../models/Service');
const Salon = require('../models/Salon');
const Appointment = require('../models/Appointment');

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pctDelta = (current, previous) => {
  if (!previous) return current > 0 ? '+100%' : '0%';
  const delta = ((current - previous) / previous) * 100;
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
};

// @desc    Top-of-page stat cards + charts + recent orders (admin/Dashboard.jsx)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const days = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  const last30Start = days(30);
  const prev30Start = days(60);

  const [revenueLast30, revenuePrev30, ordersLast30, ordersPrev30, activeCustomers, prevActiveCustomers, productsLive] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: last30Start }, orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: prev30Start, $lt: last30Start }, orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: last30Start } }),
    Order.countDocuments({ createdAt: { $gte: prev30Start, $lt: last30Start } }),
    User.countDocuments({ active: true, createdAt: { $lt: now } }),
    User.countDocuments({ active: true, createdAt: { $lt: last30Start } }),
    Product.countDocuments({ active: true }),
  ]);

  const revenue30d = revenueLast30[0]?.total || 0;
  const revenuePrevTotal = revenuePrev30[0]?.total || 0;

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const revenueByMonth = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'Cancelled' } } },
    { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, total: { $sum: '$totalAmount' } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const match = revenueByMonth.find((r) => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1);
    return { month: monthLabels[d.getMonth()], revenue: match?.total || 0 };
  });

  const categoryAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: last30Start }, orderStatus: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productDoc' } },
    { $unwind: { path: '$productDoc', preserveNullAndEmptyArrays: true } },
    { $group: { _id: '$productDoc.category', revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
  ]);
  const categoryIds = categoryAgg.map((c) => c._id).filter(Boolean);
  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name');
  const categoryNameMap = new Map(categories.map((c) => [String(c._id), c.name]));
  const totalCategoryRevenue = categoryAgg.reduce((sum, c) => sum + c.revenue, 0) || 1;
  const categorySales = categoryAgg
    .map((c) => ({
      category: c._id ? categoryNameMap.get(String(c._id)) || 'Other' : 'Other',
      value: Math.round((c.revenue / totalCategoryRevenue) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  const sevenDaysAgo = days(7);
  const ordersByDayAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
  ]);
  const dayCountMap = new Map(ordersByDayAgg.map((d) => [d._id, d.count]));
  const ordersByDay = DAY_NAMES.map((day, i) => ({ day, count: dayCountMap.get(i + 1) || 0 }));

  const recentOrders = await Order.find().populate('user', 'name').sort('-createdAt').limit(10);

  res.status(200).json({
    success: true,
    message: 'Dashboard stats fetched successfully',
    data: {
      stats: {
        revenue30d,
        revenueDelta: pctDelta(revenue30d, revenuePrevTotal),
        orders30d: ordersLast30,
        ordersDelta: pctDelta(ordersLast30, ordersPrev30),
        activeCustomers,
        activeCustomersDelta: pctDelta(activeCustomers, prevActiveCustomers),
        productsLive,
      },
      revenueTrend,
      categorySales,
      ordersByDay,
      recentOrders,
    },
  });
});

// @desc    Customer directory with lifetime order stats (AdminCustomers.jsx)
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.aggregate([
    { $match: { role: { $in: ['Salon', 'Spa', 'Beautician'] } } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders',
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        role: 1,
        active: 1,
        createdAt: 1,
        orderCount: { $size: '$orders' },
        lifetimeSpend: { $sum: '$orders.totalAmount' },
      },
    },
    { $sort: { lifetimeSpend: -1 } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Customers fetched successfully',
    data: customers,
  });
});

// @desc    All users (admin user management)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter).sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: users,
  });
});

// @desc    Activate/deactivate a user account
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (typeof req.body.active !== 'boolean') {
    res.status(400);
    throw new Error('active (boolean) is required');
  }

  user.active = req.body.active;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
    data: user.toSafeObject(),
  });
});

// @desc    Seed database from frontend data
// @route   POST /api/admin/seed
// @access  Private/Admin
const seedDatabase = asyncHandler(async (req, res) => {
  const { categories, brands, salons, spas, services, products } = req.body;

  if (!categories || !products) {
    res.status(400);
    throw new Error('Missing seed data from frontend');
  }

  await Category.deleteMany();
  await Brand.deleteMany();
  await Service.deleteMany();
  await Salon.deleteMany();
  await Product.deleteMany();

  const catMap = {};
  for (const c of categories) {
    const newCat = await Category.create({ name: c.name, slug: c.id, icon: c.icon, img: c.img, desc: c.desc });
    catMap[c.id] = newCat._id;
  }

  const brandMap = {};
  for (const b of brands) {
    const newB = await Brand.create({ name: b.name, slug: b.id, logo: b.logo, coverImage: b.img, type: 'Product' });
    brandMap[b.id] = newB._id;
  }

  const serviceMap = {};
  for (const s of services) {
    const newS = await Service.create({ name: s.name, category: s.category, duration: s.duration, priceFrom: s.priceFrom });
    serviceMap[s.id] = newS._id;
  }

  for (const p of products) {
    await Product.create({
      name: p.name,
      slug: p.id,
      sku: p.sku || `SKU-${Math.floor(Math.random()*10000)}`,
      brand: brandMap[p.brandId] || Object.values(brandMap)[0],
      category: catMap[p.categoryId] || Object.values(catMap)[0],
      price: p.price,
      mrp: p.mrp || Math.round(p.price * 1.2),
      stock: 100,
      rating: p.rating,
      numReviews: p.reviews,
      img: p.img,
      videoUrl: p.videoUrl || '',
      isAnimated: p.isAnimated || false,
      active: true
    });
  }

  for (const s of [...(salons || []), ...(spas || [])]) {
    await Salon.create({
      owner: req.user._id,
      name: s.name,
      slug: s.id,
      type: s.type === 'Spa' ? 'Spa' : 'Salon',
      city: s.city || 'Chennai',
      address: s.address || '',
      phone: s.phone || '',
      coverImage: s.coverImage || '',
      gallery: s.gallery || [],
      videoUrl: s.videoUrl || '',
      description: s.description || '',
      openingHours: s.openingHours || 'Mon-Sun . 9:00 AM - 8:30 PM',
      priceRange: s.priceRange || '\u20B9\u20B9',
      rating: s.rating || 0,
      numReviews: s.reviews || 0,
      packages: s.packages || []
    });
  }

  res.status(201).json({ success: true, message: 'Database seeded successfully!' });
});

// @desc    Get all appointments (admin view)
// @route   GET /api/admin/appointments
// @access  Private/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.bookingStatus = req.query.status;

  const appointments = await Appointment.find(filter)
    .populate('customer', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    message: 'Appointments fetched successfully',
    data: appointments,
  });
});

module.exports = { getDashboardStats, getCustomers, getUsers, updateUserStatus, seedDatabase, getAllAppointments };
