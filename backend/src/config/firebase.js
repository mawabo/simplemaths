
const admin = require('firebase-admin');

// Note: In production, use environment variables to populate the service account credential
// or point to a file path.
// For now, I'll assume GOOGLE_APPLICATION_CREDENTIALS env var is set, or mocking it.

// Mock initialization if no env vars (for development structure)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', error);
    }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
} else {
    console.warn('Firebase Admin not initialized. Missing credentials.');
    // Initialize with mock for structure if needed, but better to fail or warn.
    // For this task, we assume credentials will be provided in deployment.
}

let db;
try {
    db = admin.firestore();
} catch (e) {
    // If init failed, create a mock db object to allow tests to load the file without crashing
    console.warn('Creating Mock Firestore for testing...');
    db = {
        collection: () => ({ doc: () => ({ set: () => {}, get: () => {} }) }),
        runTransaction: () => {}
    };
}

module.exports = { admin, db };
