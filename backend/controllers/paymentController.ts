import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
});

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
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
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Error al procesar el pago' });
    }
  }
});

// @desc    Webhook handler for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      res.status(400).send('Webhook Error');
    }
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Actualizar el estado del pedido a pagado
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      // Manejar el fallo del pago
      await handlePaymentFailure(failedPayment);
      break;
  }

  res.json({ received: true });
});

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const pedidoId = paymentIntent.metadata.pedidoId;
  // TODO: Actualizar el estado del pedido en la base de datos
  // Por ahora, solo registramos en consola
  console.log(`Pago exitoso para el pedido ${pedidoId}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const pedidoId = paymentIntent.metadata.pedidoId;
  // TODO: Actualizar el estado del pedido en la base de datos
  // Por ahora, solo registramos en consola
  console.log(`Pago fallido para el pedido ${pedidoId}`);
} 