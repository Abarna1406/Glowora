// ---------------------------------------------------------------------------
// TIME_SLOTS — matches src/lib/data.js's TIME_SLOTS exactly. This is a fixed
// business constant (the salon/spa booking grid), not per-venue data, so it
// lives in code rather than the database. Exposed via GET /api/services/time-slots.
// ---------------------------------------------------------------------------
const TIME_SLOTS = {
  Morning: ['9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM'],
  Afternoon: ['12:30 PM', '1:15 PM', '2:00 PM', '3:30 PM'],
  Evening: ['5:00 PM', '5:45 PM', '6:30 PM', '7:15 PM', '8:00 PM'],
};

const ALL_TIME_SLOTS = [...TIME_SLOTS.Morning, ...TIME_SLOTS.Afternoon, ...TIME_SLOTS.Evening];

module.exports = { TIME_SLOTS, ALL_TIME_SLOTS };
