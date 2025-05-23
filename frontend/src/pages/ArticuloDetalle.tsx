import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCurrency } from "../context/CurrencyContext"
import { PageLayout } from "../components/PageLayout"

interface Articulo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_usd?: number;
  stock: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  isNovedad?: boolean;
  isPromocion?: boolean;
  descuento?: number;
  exchange_rate?: {
    CLP_USD: number;
    timestamp: string;
  };
}

interface PedidoForm {
  cantidad: number;
  direccionEntrega: string;
}

function ArticuloDetalle() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const { formatPrice } = useCurrency()
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
      <PageLayout
        title="¡Pedido Creado!"
        subtitle="Tu pedido ha sido creado exitosamente."
        showCurrencySelector={false}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/pedidos'}
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                Ver mis pedidos
              </button>
              <button
                onClick={() => window.location.href = '/articulos'}
                className="w-full bg-purple-500 text-white rounded-lg px-4 py-2 hover:bg-purple-600 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error || !articulo) {
    return (
      <PageLayout
        title="Error"
        subtitle={error || "Artículo no encontrado"}
        showCurrencySelector={false}
      >
        <div className="flex items-center justify-center">
          <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
            <p className="text-red-400 text-lg">
              {error || "Artículo no encontrado"}
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={articulo.nombre}
      subtitle="Detalles del artículo"
      showCurrencySelector={true}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-gray-300">{articulo.descripcion}</p>
          
          <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Precio:</span>
              <span className="text-2xl font-bold text-blue-400">
                {formatPrice(articulo.precio, articulo.precio_usd)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Stock:</span>
              <span className={`${articulo.stock > 10 ? 'text-green-400' : 'text-orange-400'}`}>
                {articulo.stock} unidades
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-gray-400">
              <span className="font-medium">Categoría:</span> {articulo.categoria}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Subcategoría:</span> {articulo.subcategoria}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Marca:</span> {articulo.marca}
            </p>
          </div>

          {(articulo.isNovedad || articulo.isPromocion) && (
            <div className="flex gap-2">
              {articulo.isNovedad && (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  Novedad
                </span>
              )}
              {articulo.isPromocion && (
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                  {articulo.descuento}% OFF
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-700/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Realizar Pedido</h2>
          <form onSubmit={handlePedidoSubmit} className="space-y-4">
            <div>
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-400 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={pedido.cantidad}
                onChange={(e) => setPedido({ ...pedido, cantidad: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formErrors.cantidad && (
                <p className="mt-1 text-sm text-red-400">{formErrors.cantidad}</p>
              )}
            </div>

            <div>
              <label htmlFor="direccionEntrega" className="block text-sm font-medium text-gray-400 mb-1">
                Dirección de Entrega
              </label>
              <textarea
                id="direccionEntrega"
                value={pedido.direccionEntrega}
                onChange={(e) => setPedido({ ...pedido, direccionEntrega: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              {formErrors.direccionEntrega && (
                <p className="mt-1 text-sm text-red-400">{formErrors.direccionEntrega}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-4 py-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
            >
              Crear Pedido
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}

export default ArticuloDetalle 