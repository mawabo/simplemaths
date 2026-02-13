
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const adminController = require('../controllers/adminController');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Webhook for WooCommerce
router.post('/webhook/woocommerce', (req, res) => webhookController.handleOrderCompleted(req, res));

// Admin API (Protected)
router.post('/admin/create-code', authMiddleware, (req, res) => adminController.createManualCode(req, res));

// Dashboard API (Protected)
router.get('/dashboard/codes', authMiddleware, (req, res) => dashboardController.getAccessCodes(req, res));
router.get('/dashboard/waitlist', authMiddleware, (req, res) => dashboardController.getWaitlist(req, res));
router.get('/dashboard/sales-stats', authMiddleware, (req, res) => dashboardController.getSalesStats(req, res));

// Security API
router.post('/auth/request-edit', authMiddleware, (req, res) => authController.requestEditAccess(req, res));
router.post('/auth/verify-edit', authMiddleware, (req, res) => authController.verifyEditAccess(req, res));

module.exports = router;
