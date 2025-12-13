
// Helper to allow mocking db
let db;
try {
    db = require('../../config/firebase').db;
} catch (e) {
    db = null; // Mock mode
}

const COLLECTION = 'wealthManagementStats';

class WealthManagementService {

    async recordSale(salesPersonId, salesPersonName, saleDetails) {
        // saleDetails: { orderId, amount, date, customerEmail }

        const docRef = db.collection(COLLECTION).doc(salesPersonId);

        // Transaction to ensure atomicity
        await db.runTransaction(async (t) => {
            const doc = await t.get(docRef);

            let data = doc.exists ? doc.data() : {
                salesPersonId,
                salesPersonName,
                totalSales: 0,
                history: []
            };

            data.totalSales += 1;
            data.lastSaleDate = saleDetails.date;
            data.history.push(saleDetails);

            t.set(docRef, data);
        });
    }
}

module.exports = new WealthManagementService();
