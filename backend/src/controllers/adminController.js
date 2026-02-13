
const firestoreService = require('../services/firestoreService');
const emailService = require('../services/emailService');
const Generator = require('../utils/generator');

class AdminController {

    async createManualCode(req, res) {
        const { email, appCategory, durationDays, createdBy } = req.body;

        if (!email || !appCategory) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        const code = Generator.generateCode();
        const password = Generator.generatePassword();

        // Calculate expiry
        const date = new Date();
        date.setDate(date.getDate() + (parseInt(durationDays) || 30));
        const expiryDate = date.toISOString();

        const metadata = {
            appCategory,
            durationDays: parseInt(durationDays) || 30,
            expiryDate,
            status: 'active',
            isManual: true,
            createdByAdmin: createdBy || 'API'
        };

        const result = await firestoreService.store(code, email, password, metadata);

        if (result === true) {
            await emailService.sendCredentialsToUser(email, code, password, appCategory);
            return res.status(200).send({ success: true, accessCode: code, expiryDate });
        } else {
            return res.status(500).send({ error: result });
        }
    }

    async getCodes(req, res) {
        // Implement listing codes if needed (or frontend queries Firestore directly)
        // For admin security, it is better to proxy via backend or use strict Firestore rules.
        // We'll skip implementation for now as per prompt focus on "conversion".
        res.status(501).send('Not implemented');
    }
}

module.exports = new AdminController();
