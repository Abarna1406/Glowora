const express = require('express');
const router = express.Router();

const { getSpas } = require('../controllers/salonController');

// Base path: /api/spas (see server.js) - Spas.jsx.
// SpaProfile.jsx and booking both use the shared /api/salons/:idOrSlug and
// /api/salons/:id/availability endpoints since Salon and Spa are the same
// underlying collection, distinguished by `type` (see models/Salon.js).
router.get('/', getSpas);

module.exports = router;
