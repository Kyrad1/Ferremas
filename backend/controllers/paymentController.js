const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  const { pedidoId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe works with cents
      currency: 'clp',
      metadata: {
        pedidoId,
        integration_check: 'accept_a_payment'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({ 
      message: error.message || 'Error al procesar el pago' 
    });
  }
};

// @desc    Webhook handler for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Actualizar el estado del pedido a pagado
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Manejar el fallo del pago
      await handlePaymentFailure(failedPayment);
      break;
  }

  res.json({ received: true });
};

async function handlePaymentSuccess(paymentIntent) {
  const pedidoId = paymentIntent.metadata.pedidoId;
  // TODO: Actualizar el estado del pedido en la base de datos
  console.log(`Pago exitoso para el pedido ${pedidoId}`);
}

async function handlePaymentFailure(paymentIntent) {
  const pedidoId = paymentIntent.metadata.pedidoId;
  // TODO: Actualizar el estado del pedido en la base de datos
  console.log(`Pago fallido para el pedido ${pedidoId}`);
}

module.exports = {
  createPaymentIntent,
  handleWebhook
}; 