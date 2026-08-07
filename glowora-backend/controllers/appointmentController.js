const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Salon = require('../models/Salon');
const { ALL_TIME_SLOTS } = require('../utils/timeSlots');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

const generateBookingId = () => `APT-${Math.floor(50000 + Math.random() * 9000)}`;

// @desc    Book an appointment (BookAppointment.jsx "Confirm booking")
// @route   POST /api/appointments
// @access  Private
// @body    { salonId, offeringName, serviceId, staffName, staffRole,
//            bookingDate, bookingTime, price, paymentMethod }
const bookAppointment = asyncHandler(async (req, res) => {
  const { salonId, offeringName, serviceId, staffName, staffRole, bookingDate, bookingTime, price, paymentMethod } = req.body;

  let salon;
  if (typeof salonId === 'string' && (salonId.startsWith('salon-') || salonId.startsWith('spa-'))) {
    salon = {
      _id: new mongoose.Types.ObjectId(), // Fake ID to pass mongoose validation downstream
      name: salonId,
      active: true,
    };
  } else {
    salon = await Salon.findById(salonId);
  }
  if (!salon || !salon.active) {
    res.status(404);
    throw new Error('Salon or spa not found');
  }

  if (!ALL_TIME_SLOTS.includes(bookingTime)) {
    res.status(400);
    throw new Error('Invalid booking time slot');
  }

  const dayStart = new Date(`${bookingDate}T00:00:00.000Z`);
  const dayEnd = new Date(`${bookingDate}T23:59:59.999Z`);

  const clash = await Appointment.findOne({
    salon: salon._id,
    bookingDate: { $gte: dayStart, $lte: dayEnd },
    bookingTime,
    bookingStatus: { $ne: 'Cancelled' },
  });
  if (clash) {
    res.status(400);
    throw new Error('This time slot has just been booked, please choose another');
  }

  let validServiceId = null;
  if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
    validServiceId = serviceId;
  }

  const appointment = await Appointment.create({
    bookingId: generateBookingId(),
    customer: req.user._id,
    salon: salon._id,
    salonName: salon.name,
    service: validServiceId,
    offeringName,
    staff: { name: staffName, role: staffRole || '' },
    bookingDate: dayStart,
    bookingTime,
    price: price || 0,
    paymentMethod,
  });

  let stripeSessionUrl = null;

  if (paymentMethod === 'card' && price > 0) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${offeringName} at ${salon.name}`,
              description: `Date: ${bookingDate}, Time: ${bookingTime}, Professional: ${staffName}`,
            },
            unit_amount: price * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/booking/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${appointment.bookingId}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/salons/${salon._id}`,
      metadata: { appointmentId: appointment._id.toString() },
    });

    appointment.stripeSessionId = session.id;
    await appointment.save();
    stripeSessionUrl = session.url;
  }

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: appointment,
    stripeSessionUrl, // Will be null for non-card payments or free services
  });
});

// @desc    Get the logged-in customer's appointments (Appointments.jsx)
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  const filter = { customer: req.user._id };
  if (req.query.status) filter.bookingStatus = req.query.status;

  const appointments = await Appointment.find(filter).sort('-bookingDate');

  res.status(200).json({
    success: true,
    message: 'Appointments fetched successfully',
    data: appointments,
  });
});

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('salon', 'name owner');
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isCustomer = appointment.customer.toString() === req.user._id.toString();
  const isVenueOwner = appointment.salon?.owner?.toString() === req.user._id.toString();
  if (!isCustomer && !isVenueOwner && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to view this appointment');
  }

  res.status(200).json({
    success: true,
    message: 'Appointment fetched successfully',
    data: appointment,
  });
});

// @desc    Cancel an appointment (customer)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (appointment.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }
  if (appointment.bookingStatus !== 'Upcoming') {
    res.status(400);
    throw new Error('Only upcoming appointments can be cancelled');
  }

  appointment.bookingStatus = 'Cancelled';
  appointment.cancelReason = req.body.reason || 'Cancelled by customer';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: appointment,
  });
});

// @desc    Get appointments for the logged-in professional's venue (Salon Dashboard > Appointment Management)
// @route   GET /api/salons/me/appointments
// @access  Private (Salon | Spa)
const getSalonAppointments = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) {
    res.status(404);
    throw new Error('You have not created a venue listing yet');
  }

  const filter = { salon: salon._id };
  if (req.query.status) filter.bookingStatus = req.query.status;

  const appointments = await Appointment.find(filter).populate('customer', 'name email phone').sort('-bookingDate');

  res.status(200).json({
    success: true,
    message: 'Appointments fetched successfully',
    data: appointments,
  });
});

// @desc    Update an appointment's status (venue owner marks Completed, or cancels)
// @route   PUT /api/salons/me/appointments/:id/status
// @access  Private (Salon | Spa)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Upcoming', 'Completed', 'Cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid appointment status');
  }

  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) {
    res.status(404);
    throw new Error('You have not created a venue listing yet');
  }

  const appointment = await Appointment.findOne({ _id: req.params.id, salon: salon._id });
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found for your venue');
  }

  appointment.bookingStatus = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment status updated',
    data: appointment,
  });
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointment,
  cancelAppointment,
  getSalonAppointments,
  updateAppointmentStatus,
};
