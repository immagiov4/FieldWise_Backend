import firebaseAdmin from 'firebase-admin';

let admin = null;

// Configure firebase admin SDK
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'utf8'));
  admin = firebaseAdmin.initializeApp({
    credential: admin.credential.cert(serviceAccount.default)
  });
} else {
  console.warn('Firebase service account not configured, please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable to your service account key file path.');;
}

export default admin;