import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Articulo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  isNovedad?: boolean;
  isPromocion?: boolean;
  descuento?: number;
}

interface PedidoForm {
  cantidad: number;
  direccionEntrega: string;
}

function ArticuloDetalle() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [articulo, setArticulo] = useState<Articulo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pedido, setPedido] = useState<PedidoForm>({
    cantidad: 1,
    direccionEntrega: ""
  })

  useEffect(() => {
    const fetchArticulo = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL
        const response = await fetch(`${baseUrl}/api/articulos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setArticulo(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Error desconocido al cargar el artículo")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticulo()
    }
  }, [id, token])

  const handlePedidoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articulo) return

    // Validación de datos
    if (!pedido.cantidad || pedido.cantidad < 1) {
      setError("La cantidad debe ser mayor a 0")
      return
    }

    if (!pedido.direccionEntrega.trim()) {
      setError("La dirección de entrega es requerida")
      return
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL
      console.log('Enviando pedido:', {
        articuloId: articulo.id,
        cantidad: pedido.cantidad,
        direccionEntrega: pedido.direccionEntrega
      })

      const response = await fetch(`${baseUrl}/data/pedidos/nuevo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articuloId: articulo.id,
          cantidad: Number(pedido.cantidad),
          direccionEntrega: pedido.direccionEntrega.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Error response:', data)
        throw new Error(data.message || 'Error al crear el pedido')
      }

      console.log('Pedido creado:', data)
      navigate('/pedidos')
    } catch (e) {
      console.error('Error completo:', e)
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error desconocido al crear el pedido")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  if (error || !articulo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
          <p className="text-red-400 text-lg">
            {error || "Artículo no encontrado"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            {articulo.nombre}
          </h1>

          <div className="space-y-4 text-gray-300">
            <p className="text-lg">{articulo.descripcion}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  ${articulo.precio.toFixed(2)}
                </p>
                {articulo.isPromocion && (
                  <p className="text-sm text-green-400">
                    ¡En promoción! {articulo.descuento}% de descuento
                  </p>
                )}
              </div>
              <p className={`text-sm ${articulo.stock > 10 ? 'text-green-400' : 'text-orange-400'}`}>
                Stock disponible: {articulo.stock} unidades
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Categoría</p>
                <p>{articulo.categoria}</p>
              </div>
              <div>
                <p className="text-gray-400">Subcategoría</p>
                <p>{articulo.subcategoria}</p>
              </div>
              <div>
                <p className="text-gray-400">Marca</p>
                <p>{articulo.marca}</p>
              </div>
            </div>

            <form onSubmit={handlePedidoSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-400">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="cantidad"
                  min="1"
                  max={articulo.stock}
                  value={pedido.cantidad}
                  onChange={(e) => setPedido({ ...pedido, cantidad: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 text-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-400">
                  Dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  value={pedido.direccionEntrega}
                  onChange={(e) => setPedido({ ...pedido, direccionEntrega: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-gray-700/50 border border-gray-600 text-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Crear Pedido
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticuloDetalle 