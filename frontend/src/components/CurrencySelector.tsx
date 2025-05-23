import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: 'CLP' | 'USD') => {
    setCurrency(newCurrency);
  };

  return (
    <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
      <div className="flex items-center gap-2">
        <svg 
          className="w-5 h-5 text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-gray-300 font-medium">Moneda:</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleCurrencyChange('CLP')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currency === 'CLP'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
          }`}
        >
          CLP
        </button>
        <button
          onClick={() => handleCurrencyChange('USD')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currency === 'USD'
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/20'
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
          }`}
        >
          USD
        </button>
      </div>
    </div>
  );
}; 