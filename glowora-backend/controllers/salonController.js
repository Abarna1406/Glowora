const asyncHandler = require('express-async-handler');
const Salon = require('../models/Salon');
const Appointment = require('../models/Appointment');
const { ALL_TIME_SLOTS } = require('../utils/timeSlots');

const PAGE_SIZE = 12; // matches Salons.jsx / Spas.jsx PAGE_SIZE

// @desc    Get salons - Salons.jsx (filters: city, serviceId; paginated)
// @route   GET /api/salons
// @access  Public
const getSalons = asyncHandler(async (req, res) => {
  const filter = { type: 'Salon', active: true };
  if (req.query.city && req.query.city !== 'All Cities') filter.city = req.query.city;
  if (req.query.serviceId) filter.services = req.query.serviceId;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || PAGE_SIZE);

  const [salons, total] = await Promise.all([
    Salon.find(filter)
      .populate('services', 'name category')
      .sort('-rating')
      .skip((page - 1) * limit)
      .limit(limit),
    Salon.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Salons fetched successfully',
    data: salons,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @desc    Get spas - Spas.jsx (filter: city; paginated)
// @route   GET /api/spas
// @access  Public
const getSpas = asyncHandler(async (req, res) => {
  const filter = { type: 'Spa', active: true };
  if (req.query.city && req.query.city !== 'All Cities') filter.city = req.query.city;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || PAGE_SIZE);

  const [spas, total] = await Promise.all([
    Salon.find(filter)
      .sort('-rating')
      .skip((page - 1) * limit)
      .limit(limit),
    Salon.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Spas fetched successfully',
    data: spas,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @desc    Get a single salon or spa by id/slug (SalonProfile.jsx / SpaProfile.jsx / BookAppointment.jsx)
// @route   GET /api/salons/:idOrSlug
// @access  Public
const getVenue = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const venue = await Salon.findOne(query).populate('services', 'name category duration priceFrom');
  if (!venue) {
    res.status(404);
    throw new Error('Salon or spa not found');
  }

  res.status(200).json({
    success: true,
    message: 'Venue fetched successfully',
    data: venue,
  });
});

// @desc    Get real-time slot availability for a venue on a given date
//          (replaces the mock data's static bookedSlots field - real
//          availability must be date-specific, computed from Appointments)
// @route   GET /api/salons/:id/availability?date=YYYY-MM-DD
// @access  Public
const getAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error('A date query parameter (YYYY-MM-DD) is required');
  }

  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const booked = await Appointment.find({
    salon: req.params.id,
    bookingDate: { $gte: dayStart, $lte: dayEnd },
    bookingStatus: { $ne: 'Cancelled' },
  }).select('bookingTime -_id');

  const bookedTimes = booked.map((b) => b.bookingTime);
  const availableTimes = ALL_TIME_SLOTS.filter((t) => !bookedTimes.includes(t));

  res.status(200).json({
    success: true,
    message: 'Availability fetched successfully',
    data: { date, bookedTimes, availableTimes },
  });
});

// @desc    Create a salon/spa listing (Admin, or a Salon/Spa professional creating their own)
// @route   POST /api/salons
// @access  Private (Salon | Spa | Admin)
const createSalon = asyncHandler(async (req, res) => {
  const { name, type, city, area, address, phone, email, description, openingHours, priceRange, services, packages } = req.body;

  if (req.user.role !== 'Admin' && (await Salon.countDocuments({ owner: req.user._id }))) {
    res.status(400);
    throw new Error('You already have a venue listing. Contact support to add another.');
  }

  const salon = await Salon.create({
    owner: req.user._id,
    name,
    type: type || (req.user.role === 'Spa' ? 'Spa' : 'Salon'),
    city,
    area,
    address,
    phone,
    email,
    description,
    openingHours,
    priceRange,
    services: services || [],
    packages: packages || [],
  });

  res.status(201).json({
    success: true,
    message: 'Venue created successfully',
    data: salon,
  });
});

// @desc    Update a salon/spa (owner or Admin)
// @route   PUT /api/salons/:id
// @access  Private
const updateSalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) {
    res.status(404);
    throw new Error('Venue not found');
  }
  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this venue');
  }

  const fields = [
    'name', 'city', 'area', 'address', 'phone', 'email', 'coverImage', 'logo', 'gallery',
    'description', 'openingHours', 'priceRange', 'services', 'packages', 'staff', 'active',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) salon[f] = req.body[f];
  });

  const updated = await salon.save();

  res.status(200).json({
    success: true,
    message: 'Venue updated successfully',
    data: updated,
  });
});

// @desc    Delete a salon/spa
// @route   DELETE /api/salons/:id
// @access  Private (owner or Admin)
const deleteSalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) {
    res.status(404);
    throw new Error('Venue not found');
  }
  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this venue');
  }

  await salon.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Venue deleted successfully',
    data: null,
  });
});

// @desc    Get the logged-in professional's own venue (Salon Dashboard)
// @route   GET /api/salons/me/venue
// @access  Private (Salon | Spa)
const getMyVenue = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id }).populate('services', 'name category duration priceFrom');
  if (!salon) {
    res.status(404);
    throw new Error('You have not created a venue listing yet');
  }

  res.status(200).json({
    success: true,
    message: 'Venue fetched successfully',
    data: salon,
  });
});

// @desc    Earnings summary for the logged-in professional's venue (Salon Dashboard > Earnings)
// @route   GET /api/salons/me/earnings
// @access  Private (Salon | Spa)
const getMyEarnings = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) {
    res.status(404);
    throw new Error('You have not created a venue listing yet');
  }

  const [totals] = await Appointment.aggregate([
    { $match: { salon: salon._id, bookingStatus: 'Completed' } },
    { $group: { _id: null, totalEarnings: { $sum: '$price' }, completedBookings: { $sum: 1 } } },
  ]);

  const upcomingBookings = await Appointment.countDocuments({ salon: salon._id, bookingStatus: 'Upcoming' });

  res.status(200).json({
    success: true,
    message: 'Earnings fetched successfully',
    data: {
      totalEarnings: totals?.totalEarnings || 0,
      completedBookings: totals?.completedBookings || 0,
      upcomingBookings,
    },
  });
});

// @desc    Customers who have booked at the logged-in professional's venue (Salon Dashboard > Customers)
// @route   GET /api/salons/me/customers
// @access  Private (Salon | Spa)
const getMyCustomers = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) {
    res.status(404);
    throw new Error('You have not created a venue listing yet');
  }

  const customers = await Appointment.aggregate([
    { $match: { salon: salon._id } },
    {
      $group: {
        _id: '$customer',
        totalBookings: { $sum: 1 },
        totalSpend: { $sum: '$price' },
        lastBooking: { $max: '$bookingDate' },
      },
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.name': 1, 'user.email': 1, 'user.phone': 1, totalBookings: 1, totalSpend: 1, lastBooking: 1 } },
    { $sort: { lastBooking: -1 } },
  ]);

  res.status(200).json({
    success: true,
    message: 'Customers fetched successfully',
    data: customers,
  });
});

module.exports = {
  getSalons,
  getSpas,
  getVenue,
  getAvailability,
  createSalon,
  updateSalon,
  deleteSalon,
  getMyVenue,
  getMyEarnings,
  getMyCustomers,
};
