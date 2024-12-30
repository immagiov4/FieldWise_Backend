import firebaseAdmin from 'firebase-admin';

let admin = null;

// Configure firebase admin SDK
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'utf8'));
  admin = firebaseAdmin.initializeApp({
    credential: admin.credential.cert(serviceAccount.default)
  });
} else {
  console.warn('Firebase service account not configured');
}

export default admin;