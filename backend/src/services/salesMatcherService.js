
const waitlistService = require('./waitlistService');
const wealthService = require('./wealthManagementService');

class SalesMatcherService {

    /**
     * Called when a new Order/AccessCode is finalized.
     * Checks if the customer is on the waitlist.
     */
    async processOrder(order) {
        // order: { billing: { email, first_name, last_name }, id, date_created, ... }

        const email = order.billing.email;
        const name = `${order.billing.first_name} ${order.billing.last_name}`;

        // 1. Check Waitlist
        const waitlistEntry = await waitlistService.getByEmail(email);

        if (waitlistEntry) {
            console.log(`Sales Match Found! Order ${order.id} matched to Sales Person ${waitlistEntry.salesPersonName}`);

            // 2. Update Sales Stats in Wealth Management
            await wealthService.recordSale(
                waitlistEntry.salesPersonId,
                waitlistEntry.salesPersonName,
                {
                    orderId: order.id,
                    amount: order.total || 0, // Assuming order object has total
                    date: new Date().toISOString(), // or order.date_created
                    customerEmail: email
                }
            );

            // 3. Update Waitlist Status
            await waitlistService.markConverted(waitlistEntry.id);

            return true;
        }

        return false;
    }
}

module.exports = new SalesMatcherService();
