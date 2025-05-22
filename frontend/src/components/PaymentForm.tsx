import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Asegúrate de reemplazar esto con tu clave pública de Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  clientSecret: string;
  pedidoId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentFormContent({ onSuccess, onError, pedidoId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pago-exitoso?pedido_id=${pedidoId}`,
        },
      });

      if (error) {
        const errorMessage = encodeURIComponent(error.message || 'Error al procesar el pago');
        window.location.href = `${window.location.origin}/pago-fallido?pedido_id=${pedidoId}&error=${errorMessage}`;
        onError(error.message || 'Error al procesar el pago');
      } else {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
        onError(err.message);
      } else {
        setMessage('Ocurrió un error inesperado.');
        onError('Error inesperado');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
          Información de Pago
        </h2>
        
        <div className="mb-6">
          <PaymentElement />
        </div>

        {message && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Procesando...
            </div>
          ) : (
            'Pagar ahora'
          )}
        </button>
      </div>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#60a5fa',
        colorBackground: '#1f2937',
        colorText: '#f3f4f6',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent {...props} />
    </Elements>
  );
} 