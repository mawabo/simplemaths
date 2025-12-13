
// Helper to allow mocking db
let db;
try {
    db = require('../../config/firebase').db;
} catch (e) {
    db = null; // Mock mode
}

const COLLECTION = 'wealthManagementStats';

class WealthManagementService {

    /**
     * Calculates the most recent Wednesday (Start of the sales week).
     * If today is Wednesday, it is today.
     * If today is Tuesday, it is last Wednesday.
     */
    getRecentWednesday(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, ...

        // Calculate difference to get to last Wednesday
        // If day is 3 (Wed), diff is 0.
        // If day is 4 (Thu), diff is 1.
        // If day is 0 (Sun), diff is 4 (Sun->Sat->Fri->Thu->Wed).
        // If day is 2 (Tue), diff is 6 (Tue->Mon->Sun...->Wed).

        let diff = day - 3;
        if (diff < 0) {
            diff += 7;
        }

        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0); // Reset time to start of day
        return d;
    }

    async recordSale(salesPersonId, salesPersonName, saleDetails) {
        // saleDetails: { orderId, amount, date, customerEmail }

        if (!db) return; // Guard for mock mode if not handled elsewhere

        const docRef = db.collection(COLLECTION).doc(salesPersonId);
        const saleDate = new Date();
        const currentSalesWeekStart = this.getRecentWednesday(saleDate).toISOString();

        // Transaction to ensure atomicity
        await db.runTransaction(async (t) => {
            const doc = await t.get(docRef);

            let data = doc.exists ? doc.data() : {
                salesPersonId,
                salesPersonName,
                lifetimeSales: 0,
                weeklySales: 0,
                currentWeekStart: currentSalesWeekStart,
                history: []
            };

            // Check for Wednesday Reset
            // If the stored week start is OLDER than the calculated current week start, reset.
            if (!data.currentWeekStart || new Date(data.currentWeekStart) < new Date(currentSalesWeekStart)) {
                // Archive the old week (optional, but good for history)
                // For now, we just reset the counter as requested.
                data.weeklySales = 0;
                data.currentWeekStart = currentSalesWeekStart;
            }

            // Increment Counters
            data.weeklySales += 1;
            data.lifetimeSales = (data.lifetimeSales || 0) + 1; // Ensure backward compat if field didn't exist

            // Legacy field support (optional, if we want to keep totalSales as lifetime)
            data.totalSales = data.lifetimeSales;

            data.lastSaleDate = saleDetails.date;
            data.history.push(saleDetails);

            t.set(docRef, data);
        });
    }
}

module.exports = new WealthManagementService();
