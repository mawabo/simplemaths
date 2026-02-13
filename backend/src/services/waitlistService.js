
// Helper to allow mocking db
let db;
try {
    db = require('../../config/firebase').db;
} catch (e) {
    db = null; // Mock mode
}

const COLLECTION = 'waitlist';

class WaitlistService {

    async addPerson(data) {
        // data: { name, email, whatsapp, salesPersonId, salesPersonName }
        const docRef = db.collection(COLLECTION).doc();
        const entry = {
            id: docRef.id,
            ...data,
            dateAdded: new Date().toISOString(),
            status: 'pending'
        };
        await docRef.set(entry);
        return entry;
    }

    async search(query) {
        // Simple search by email or name
        // Firestore simple query limits: startAt/endAt or '=='
        // We will prioritize Email exact match or iterate.
        // For scalability, we might need a separate index, but for now:

        let results = [];

        // Search by email
        const emailSnap = await db.collection(COLLECTION).where('email', '==', query).get();
        emailSnap.forEach(doc => results.push(doc.data()));

        // If no email match, maybe try name? (Case sensitive in Firestore default)
        if (results.length === 0) {
             const nameSnap = await db.collection(COLLECTION).where('name', '==', query).get();
             nameSnap.forEach(doc => results.push(doc.data()));
        }

        return results;
    }

    async getByEmail(email) {
        const snap = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();
        if (snap.empty) return null;
        return snap.docs[0].data();
    }

    async markConverted(id) {
        await db.collection(COLLECTION).doc(id).update({ status: 'converted' });
    }
}

module.exports = new WaitlistService();
