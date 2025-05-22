import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Pedido {
  id: string;
  articuloId: string;
  cantidad: number;
  direccionEntrega: string;
  estado: string;
  fechaCreacion: string;
  total: number;
  clienteId: string;
  articulo: {
    id: string;
    nombre: string;
    precio: number;
  };
}

function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL
        const response = await fetch(`${baseUrl}/data/pedidos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al cargar los pedidos')
        }

        const data = await response.json()
        setPedidos(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Error desconocido al cargar los pedidos")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
          <p className="text-red-400 text-lg">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/articulos"
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
            Volver a artículos
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
            Mis Pedidos
          </h1>
          <p className="text-gray-400 text-lg">Historial de tus compras en Ferremas</p>
        </header>

        {pedidos.length > 0 ? (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <Link
                to={`/pedidos/${pedido.id}`}
                key={pedido.id}
                className="block bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400">
                      {pedido.articulo.nombre}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Pedido #{pedido.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      ${pedido.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Cantidad: {pedido.cantidad}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="text-gray-400">Estado</p>
                    <p className="capitalize">{pedido.estado}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fecha</p>
                    <p>{new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Dirección de entrega</p>
                    <p>{pedido.direccionEntrega}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <p className="text-gray-500 text-xl">
              No tienes pedidos realizados.
            </p>
            <Link
              to="/articulos"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ver artículos disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pedidos 