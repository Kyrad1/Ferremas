import React, { useState, useEffect } from "react"

interface Sucursal {
  id: string
  localidad: string
}

function Sucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Estado de sucursales actualizado:', sucursales);
  }, [sucursales]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        console.log('URL de la API:', `${baseUrl}/api/sucursales`);
        const response = await fetch(`${baseUrl}/api/sucursales`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Datos recibidos:', data);
        setSucursales(data)
      } catch (e) {
        console.error('Error completo:', e);
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSucursales()
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
            Error al cargar sucursales: {error}
          </p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
          Sucursales Ferremas
        </h1>
        <p className="text-gray-400 text-lg">Encuentra la sucursal más cercana a ti</p>
      </header>

      {sucursales.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sucursales.map((sucursal) => (
            <div
              key={sucursal.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                Sucursal {sucursal.id}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{sucursal.localidad}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                    {sucursal.localidad}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 text-xl">
              No se encontraron sucursales disponibles.
            </p>
          </div>
        )
      )}
    </div>
  )
}

export default Sucursales 