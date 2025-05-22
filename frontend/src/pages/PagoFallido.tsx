import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function PagoFallido() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get('error') || 'Error desconocido en el pago';
  const pedidoId = searchParams.get('pedido_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/pedidos"
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
            Volver a mis pedidos
          </Link>
        </div>

        <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
              Error en el Pago
            </h1>
          </div>

          <p className="text-gray-300 mb-6">
            Lo sentimos, ha ocurrido un error al procesar tu pago. Por favor, intenta nuevamente.
          </p>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">
              {decodeURIComponent(error)}
            </p>
          </div>

          {pedidoId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                ID de Pedido: {pedidoId}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {pedidoId && (
              <>
                <Link
                  to={`/pedidos/${pedidoId}/pagar`}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Intentar pago nuevamente
                </Link>
                <Link
                  to={`/pedidos/${pedidoId}`}
                  className="block w-full px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-all duration-200"
                >
                  Volver al pedido
                </Link>
              </>
            )}
            <Link
              to="/pedidos"
              className="block w-full px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-all duration-200"
            >
              Volver a mis pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagoFallido; 