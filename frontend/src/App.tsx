import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { CurrencyProvider } from "./context/CurrencyContext"
import Home from "./pages/Home"
import Articulos from "./pages/Articulos"
import ArticuloDetalle from "./pages/ArticuloDetalle"
import Sucursales from "./pages/Sucursales"
import Vendedores from "./pages/Vendedores"
import Pedidos from "./pages/Pedidos"
import PedidoDetalle from "./pages/PedidoDetalle"
import PagarPedido from "./pages/PagarPedido"
import PagoExitoso from "./pages/PagoExitoso"
import PagoFallido from "./pages/PagoFallido"
import Login from "./pages/Login"

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articulos"
              element={
                <ProtectedRoute>
                  <Articulos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articulos/:id"
              element={
                <ProtectedRoute>
                  <ArticuloDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sucursales"
              element={
                <ProtectedRoute>
                  <Sucursales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendedores"
              element={
                <ProtectedRoute requiredRole={['admin', 'store_manager']}>
                  <Vendedores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <Pedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos/:id"
              element={
                <ProtectedRoute>
                  <PedidoDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos/:id/pagar"
              element={
                <ProtectedRoute>
                  <PagarPedido />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pago-exitoso"
              element={
                <ProtectedRoute>
                  <PagoExitoso />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pago-fallido"
              element={
                <ProtectedRoute>
                  <PagoFallido />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
