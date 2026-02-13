
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

const COLLECTION_NAME = 'accessCodeCredentials';

class FirestoreService {

    async store(accessCode, email, plainPassword, metadata = {}) {
        let passwordHash = null;

        // Note: The logic for "synced password" (from WP user) is tricky here because
        // we are decoupled from WP.
        // We assume the caller handles logic about which password to use (passed as plainPassword)
        // OR if we are receiving a hash directly.
        // For simplicity, if plainPassword looks like a bcrypt hash (starts with $2), use it.
        // Otherwise hash it.

        if (plainPassword && (plainPassword.startsWith('$2a$') || plainPassword.startsWith('$2b$'))) {
             passwordHash = plainPassword;
        } else if (plainPassword) {
            passwordHash = await bcrypt.hash(plainPassword, 10);
        }

        const credentialData = {
            accessCode: accessCode,
            email: email,
            passwordHash: passwordHash,
            appCategory: metadata.appCategory || 'Unknown',
            durationDays: parseInt(metadata.durationDays || 30),
            expiryDate: metadata.expiryDate || this.calculateExpiry(metadata.durationDays || 30),
            purchaseDate: metadata.purchaseDate || new Date().toISOString(),
            status: metadata.status || 'active',
            isManual: metadata.isManual || false,
            orderId: metadata.orderId || null,
            createdByAdmin: metadata.createdByAdmin || null,
            schemaVersion: 3,
            isSynced: metadata.isSynced || false
        };

        // Remove undefined/null
        Object.keys(credentialData).forEach(key => credentialData[key] === undefined && delete credentialData[key]);

        try {
            await db.collection(COLLECTION_NAME).doc(accessCode).set(credentialData);
            return true;
        } catch (error) {
            console.error('Error saving to Firestore:', error);
            return error.message;
        }
    }

    async extend(accessCode, newExpiryDate) {
        try {
            await db.collection(COLLECTION_NAME).doc(accessCode).update({
                expiryDate: newExpiryDate,
                status: 'active'
            });
            return true;
        } catch (error) {
            console.error('Error extending code:', error);
            return error.message;
        }
    }

    async getByEmailAndCategory(email, category) {
        // Query logic to find active code for user
        try {
            const snapshot = await db.collection(COLLECTION_NAME)
                .where('email', '==', email)
                .where('appCategory', '==', category)
                .orderBy('expiryDate', 'desc')
                .limit(1)
                .get();

            if (snapshot.empty) return null;
            return snapshot.docs[0].data();
        } catch (error) {
             console.error('Error querying Firestore:', error);
             return null;
        }
    }

    calculateExpiry(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }
}

module.exports = new FirestoreService();
