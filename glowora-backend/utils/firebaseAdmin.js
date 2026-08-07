const admin = require('firebase-admin');

// ---------------------------------------------------------------------------
// getFirebaseAdmin — initializes firebase-admin once, lazily, only when
// Google Login is actually used. Google Login is explicitly marked optional
// in the project brief, so the whole app must still boot cleanly when these
// env vars are left blank — initialization is deferred to first use instead
// of happening at import time.
// ---------------------------------------------------------------------------
let initialized = false;

const getFirebaseAdmin = () => {
  if (!initialized) {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Google Login is not configured on this server');
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    initialized = true;
  }
  return admin;
};

module.exports = getFirebaseAdmin;
