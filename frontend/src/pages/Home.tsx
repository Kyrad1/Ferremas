import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
          Ferremas
        </h1>
        <p className="text-gray-400 text-xl mb-2">
          Tu ferretería de confianza
        </p>
        <div className="text-gray-500">
          Bienvenido, {user?.username} ({user?.role})
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Link
          to="/articulos"
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-white text-lg font-semibold">Ver Artículos</span>
          </div>
        </Link>

        <Link
          to="/sucursales"
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-white text-lg font-semibold">Ver Sucursales</span>
          </div>
        </Link>
      </div>

      <button
        onClick={logout}
        className="px-6 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default Home 