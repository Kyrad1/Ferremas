import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Articulos from "./pages/Articulos"
import Sucursales from "./pages/Sucursales"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/sucursales" element={<Sucursales />} />
      </Routes>
    </Router>
  )
}

export default App
