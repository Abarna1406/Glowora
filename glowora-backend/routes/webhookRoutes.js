const express = require('express');
const router = express.Router();
const { stripeWebhook } = require('../controllers/webhookController');

// Stripe requires the raw body to verify the webhook signature
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
