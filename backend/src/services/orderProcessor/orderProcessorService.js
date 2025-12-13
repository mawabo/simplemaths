
const firestoreService = require('../firestoreService');
const emailService = require('../emailService');
const Generator = require('../../utils/generator');
const ProductParser = require('./productParser');

class OrderProcessorService {

    async processOrderItems(userEmail, items, orderId) {
        let codesGenerated = false;

        for (const item of items) {
            const productName = item.name;
            const appCategory = ProductParser.extractAppCategory(productName);
            const durationDays = ProductParser.extractDurationDays(productName);

            // Check if existing code to extend
            const existingCodeData = await firestoreService.getByEmailAndCategory(userEmail, appCategory);

            if (existingCodeData) {
                await this.extendSubscription(userEmail, existingCodeData, appCategory, durationDays);
            } else {
                await this.createNewSubscription(userEmail, appCategory, durationDays, orderId);
            }
            codesGenerated = true;
        }

        return codesGenerated;
    }

    async extendSubscription(userEmail, existingCodeData, appCategory, durationDays) {
        const newExpiry = ProductParser.calculateExpiryDate(durationDays);
        await firestoreService.extend(existingCodeData.accessCode, newExpiry);
        await emailService.sendExtensionNotification(userEmail, existingCodeData.accessCode, appCategory, newExpiry);
    }

    async createNewSubscription(userEmail, appCategory, durationDays, orderId) {
        const code = Generator.generateCode();
        const password = Generator.generatePassword();
        const expiryDate = ProductParser.calculateExpiryDate(durationDays);

        const metadata = {
            appCategory,
            durationDays,
            expiryDate,
            status: 'active',
            orderId: orderId,
            purchaseDate: new Date().toISOString()
        };

        const result = await firestoreService.store(code, userEmail, password, metadata);

        if (result === true) {
            await emailService.sendCredentialsToUser(userEmail, code, password, appCategory);
        }
    }
}

module.exports = new OrderProcessorService();
