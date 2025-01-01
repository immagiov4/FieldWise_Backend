import admin from '../config/firebase.js';

// Authentication middleware to verify Firebase ID token
// the token is sent in the Authorization header as a Bearer token
export const authenticate = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test' || process.env.BYPASS_AUTH == 'true') return next();

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};