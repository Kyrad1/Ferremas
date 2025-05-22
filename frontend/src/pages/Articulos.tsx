import React, { useState, useEffect } from "react"

interface Articulo {
  id: number
  nombre: string
  precio: number
  stock: number
  categoria: string
  subcategoria: string
  marca: string
}

function Articulos() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        
        const response = await fetch(`${baseUrl}/api/articulos`)
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
  }, [])

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
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
          Artículos de Ferremas
        </h1>
        <p className="text-gray-400 text-lg">Encuentra todo lo que necesitas para tu proyecto</p>
      </header>

      {articulos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articulos.map((articulo) => (
            <div
              key={articulo.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                {articulo.nombre}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="font-medium">Precio</span>
                  <span className="text-xl font-bold text-green-400">
                    ${articulo.precio.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="font-medium">Stock</span>
                  <span className={`font-semibold ${articulo.stock > 10 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {articulo.stock} unidades
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                      {articulo.categoria}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                      {articulo.subcategoria}
                    </span>
                    <span className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-full text-sm">
                      {articulo.marca}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 text-xl">
              No se encontraron artículos disponibles.
            </p>
          </div>
        )
      )}
    </div>
  )
}

export default Articulos 