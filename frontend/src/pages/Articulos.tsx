import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
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

function Articulos() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth();

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        
        const response = await fetch(`${baseUrl}/api/articulos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setArticulos(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchArticulos()
  }, [token])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
          <p className="text-red-400 text-lg">
            Error al cargar artículos: {error}
          </p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
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
            Volver al inicio
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
            Artículos de Ferremas
          </h1>
          <p className="text-gray-400 text-lg">Encuentra todo lo que necesitas para tu proyecto</p>
        </header>

        {articulos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulos.map((articulo) => (
              <Link
                to={`/articulos/${articulo.id}`}
                key={articulo.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  {articulo.nombre}
                </h2>
                <div className="space-y-2 text-gray-300">
                  <p>{articulo.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-blue-400">
                      ${articulo.precio.toFixed(2)}
                    </p>
                    <p className={`text-sm ${articulo.stock > 10 ? 'text-green-400' : 'text-orange-400'}`}>
                      Stock: {articulo.stock}
                    </p>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-400">
                    <p>Categoría: {articulo.categoria}</p>
                    <p>Subcategoría: {articulo.subcategoria}</p>
                    <p>Marca: {articulo.marca}</p>
                  </div>
                  {(articulo.isNovedad || articulo.isPromocion) && (
                    <div className="flex gap-2 mt-3">
                      {articulo.isNovedad && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                          Novedad
                        </span>
                      )}
                      {articulo.isPromocion && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                          {articulo.descuento}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 text-xl">
              No se encontraron artículos disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Articulos 