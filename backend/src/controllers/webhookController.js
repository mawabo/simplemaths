
const salesMatcherService = require('../services/salesMatcherService');
const orderProcessorService = require('../services/orderProcessor/orderProcessorService');

class WebhookController {

    // This method handles the WooCommerce webhook payload
    async handleOrderCompleted(req, res) {
        const order = req.body;

        if (!order || !order.status) {
             return res.status(400).send('Invalid Order Data');
        }

        if (order.status !== 'completed' && order.status !== 'processing') {
            return res.status(200).send('Order status ignored');
        }

        console.log('Processing Order:', order.id);

        // 1. Match Sales (Async)
        salesMatcherService.processOrder(order).catch(err => console.error('Sales Match Error', err));

        // 2. Process Subscription Generation
        try {
            const userEmail = order.billing.email;
            const lineItems = order.line_items;

            const codesGenerated = await orderProcessorService.processOrderItems(userEmail, lineItems, order.id);

            res.status(200).send({ success: true, codesGenerated });
        } catch (e) {
            console.error('Order Processing Error', e);
            res.status(500).send({ error: 'Internal Server Error during processing' });
        }
    }
}

module.exports = new WebhookController();
