const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');

// @desc    Handle Stripe webhooks
// @route   POST /api/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // We need the raw body to construct the event
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Check metadata to determine if it's an Order or Appointment
      if (session.metadata?.orderId) {
        await Order.findByIdAndUpdate(session.metadata.orderId, {
          paymentStatus: 'paid',
          stripePaymentIntentId: session.payment_intent,
        });
        console.log(`Order ${session.metadata.orderId} marked as paid`);
      } else if (session.metadata?.appointmentId) {
        await Appointment.findByIdAndUpdate(session.metadata.appointmentId, {
          paymentStatus: 'paid',
          stripePaymentIntentId: session.payment_intent,
        });
        console.log(`Appointment ${session.metadata.appointmentId} marked as paid`);
      }
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = {
  stripeWebhook,
};
