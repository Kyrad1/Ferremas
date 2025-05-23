import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
  hoverGradient: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, gradient, hoverGradient }) => (
  <Link
    to={to}
    className={`group relative px-8 py-4 bg-gradient-to-r ${gradient} rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20`}
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    <div className="relative flex items-center space-x-4">
      {icon}
      <span className="text-white text-lg font-semibold">{text}</span>
    </div>
  </Link>
);

export const Navigation: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'store_manager';

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <NavLink
        to="/articulos"
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
        text="Ver Artículos"
        gradient="from-blue-500 to-blue-600"
        hoverGradient="from-blue-600 to-purple-600"
      />

      <NavLink
        to="/sucursales"
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        text="Ver Sucursales"
        gradient="from-purple-500 to-purple-600"
        hoverGradient="from-purple-600 to-blue-600"
      />

      {isAdmin && (
        <NavLink
          to="/vendedores"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          text="Ver Vendedores"
          gradient="from-green-500 to-green-600"
          hoverGradient="from-green-600 to-blue-600"
        />
      )}
    </div>
  );
}; 