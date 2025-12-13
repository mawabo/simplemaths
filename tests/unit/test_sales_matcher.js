
const assert = require('assert');
const salesMatcherService = require('../../backend/src/services/salesMatcherService');
const waitlistService = require('../../backend/src/services/waitlistService');
const wealthService = require('../../backend/src/services/wealthManagementService');

// Mock dependencies
let waitlistDB = {};
let wealthDB = {};

waitlistService.getByEmail = async (email) => {
    return Object.values(waitlistDB).find(x => x.email === email) || null;
};
waitlistService.markConverted = async (id) => {
    if (waitlistDB[id]) waitlistDB[id].status = 'converted';
};

wealthService.recordSale = async (id, name, details) => {
    if (!wealthDB[id]) {
        wealthDB[id] = { totalSales: 0, history: [] };
    }
    wealthDB[id].totalSales++;
    wealthDB[id].history.push(details);
};

// Test
(async () => {
    console.log('Testing Sales Matcher...');

    // Setup Waitlist
    waitlistDB['1'] = { id: '1', name: 'John Doe', email: 'john@example.com', salesPersonId: 'sp1', salesPersonName: 'Agent Smith', status: 'pending' };

    // Process Order
    const order = {
        id: 'ord_123',
        total: 100,
        billing: { email: 'john@example.com', first_name: 'John', last_name: 'Doe' }
    };

    const matched = await salesMatcherService.processOrder(order);

    assert.strictEqual(matched, true, 'Should match waitlist email');
    assert.strictEqual(waitlistDB['1'].status, 'converted', 'Waitlist status should change to converted');
    assert.strictEqual(wealthDB['sp1'].totalSales, 1, 'Sales person stats should increment');

    console.log('Sales Matcher Logic Passed!');
})();
