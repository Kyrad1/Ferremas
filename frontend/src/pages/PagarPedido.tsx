import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PaymentForm } from '../components/PaymentForm';

interface Pedido {
  id: string;
  total: number;
  estado: string;
  articulo: {
    nombre: string;
  };
}

function PagarPedido() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/data/pedidos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el pedido');
        }

        const data = await response.json();
        setPedido(data);

        // Crear intención de pago
        const paymentResponse = await fetch(`${baseUrl}/api/payments/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            pedidoId: data.id,
            amount: data.total
          })
        });

        if (!paymentResponse.ok) {
          throw new Error('Error al crear la intención de pago');
        }

        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPedido();
    }
  }, [id, token]);

  const handlePaymentSuccess = () => {
    navigate('/pedidos', { state: { paymentSuccess: true } });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
          <p className="text-red-400 text-lg">
            {error || "Pedido no encontrado"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to={`/pedidos/${id}`}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al pedido
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Pagar Pedido
          </h1>
          <p className="text-gray-400">
            Pedido #{id} - {pedido.articulo.nombre}
          </p>
          <p className="text-xl font-bold text-blue-400 mt-2">
            Total: ${pedido.total.toFixed(2)}
          </p>
        </div>

        {clientSecret && (
          <PaymentForm
            clientSecret={clientSecret}
            pedidoId={pedido.id}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </div>
    </div>
  );
}

export default PagarPedido; 