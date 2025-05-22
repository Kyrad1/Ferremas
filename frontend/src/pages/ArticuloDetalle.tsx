import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
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
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    cantidad?: string;
    direccionEntrega?: string;
  }>({})
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
    
    // Reset form errors
    setFormErrors({})
    
    // Validate form
    const errors: { cantidad?: string; direccionEntrega?: string } = {}
    
    if (!pedido.cantidad || pedido.cantidad < 1) {
      errors.cantidad = "La cantidad debe ser mayor a 0"
    }
    
    if (!pedido.direccionEntrega.trim()) {
      errors.direccionEntrega = "La dirección de entrega es requerida"
    }
    
    // If there are errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (!articulo) return

    try {
      const baseUrl = import.meta.env.VITE_API_URL
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
        throw new Error(data.message || 'Error al crear el pedido')
      }

      setSuccess(true)
    } catch (e) {
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">¡Pedido Creado!</h2>
            <p className="text-gray-300 mb-6">Tu pedido ha sido creado exitosamente.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/pedidos')}
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/articulos')}
              className="w-full bg-purple-500 text-white rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        </div>
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
        <div className="mb-8">
          <Link
            to="/articulos"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            ← Volver a artículos
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

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
                  className={`mt-1 block w-full rounded-md bg-gray-700/50 border ${
                    formErrors.cantidad ? 'border-red-500' : 'border-gray-600'
                  } text-gray-300 px-3 py-2`}
                />
                {formErrors.cantidad && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.cantidad}</p>
                )}
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-400">
                  Dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  value={pedido.direccionEntrega}
                  onChange={(e) => setPedido({ ...pedido, direccionEntrega: e.target.value })}
                  className={`mt-1 block w-full rounded-md bg-gray-700/50 border ${
                    formErrors.direccionEntrega ? 'border-red-500' : 'border-gray-600'
                  } text-gray-300 px-3 py-2`}
                  rows={3}
                />
                {formErrors.direccionEntrega && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.direccionEntrega}</p>
                )}
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