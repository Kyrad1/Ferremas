import React from 'react';
import { Link } from 'react-router-dom';
import { CurrencySelector } from './CurrencySelector';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showCurrencySelector?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showCurrencySelector = false,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
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
          {showCurrencySelector && <CurrencySelector />}
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-lg">{subtitle}</p>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}; 