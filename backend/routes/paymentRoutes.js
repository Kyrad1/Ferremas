const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta protegida para crear intención de pago
router.post('/create-payment-intent', protect, express.json(), createPaymentIntent);

// Ruta pública para webhook de Stripe - debe estar ANTES de cualquier middleware que procese el body
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router; 