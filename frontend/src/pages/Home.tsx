import React from "react"
import { useAuth } from "../context/AuthContext"
import { Navigation } from "../components/Navigation"

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

      <Navigation />

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