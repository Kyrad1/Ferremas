import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Pedido {
  id: string;
  articuloId: string;
  cantidad: number;
  direccionEntrega: string;
  estado: string;
  fechaCreacion: string;
  total: number;
  articulo: {
    id: string;
    nombre: string;
    precio: number;
    descripcion: string;
  };
}

function PedidoDetalle() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL
        const response = await fetch(`${baseUrl}/api/pedidos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setPedido(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Error desconocido al cargar el pedido")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPedido()
    }
  }, [id, token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/pedidos"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            ← Volver a mis pedidos
          </Link>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Pedido #{pedido.id}
              </h1>
              <p className="text-gray-400">
                Realizado el {new Date(pedido.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">
                ${pedido.total.toFixed(2)}
              </p>
              <p className="text-gray-400">Total del pedido</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                Detalles del Artículo
              </h2>
              <div className="space-y-4">
                <Link
                  to={`/articulos/${pedido.articulo.id}`}
                  className="text-lg text-white hover:text-blue-400 transition-colors"
                >
                  {pedido.articulo.nombre}
                </Link>
                <p className="text-gray-300">{pedido.articulo.descripcion}</p>
                <div className="flex justify-between text-gray-400">
                  <p>Precio unitario: ${pedido.articulo.precio.toFixed(2)}</p>
                  <p>Cantidad: {pedido.cantidad}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                Estado del Pedido
              </h2>
              <p className="text-lg capitalize text-white">
                {pedido.estado}
              </p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">
                Dirección de Entrega
              </h2>
              <p className="text-white whitespace-pre-line">
                {pedido.direccionEntrega}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PedidoDetalle 