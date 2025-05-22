import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function PagoExitoso() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const payment_intent = searchParams.get('payment_intent');
  const pedidoId = searchParams.get('pedido_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            ¡Pago Exitoso!
          </h1>
        </div>

        <p className="text-gray-300 mb-6">
          Tu pago ha sido procesado correctamente. Hemos enviado un correo de confirmación con los detalles de tu pedido.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            ID de Pago: {payment_intent}
          </p>
          <p className="text-sm text-gray-400">
            ID de Pedido: {pedidoId}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            to={`/pedidos/${pedidoId}`}
            className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Ver detalles del pedido
          </Link>
          <Link
            to="/pedidos"
            className="block w-full px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-all duration-200"
          >
            Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PagoExitoso; 