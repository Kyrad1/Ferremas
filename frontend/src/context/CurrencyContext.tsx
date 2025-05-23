import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'CLP' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, usdPrice?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('CLP');

  const formatPrice = (price: number, usdPrice?: number): string => {
    if (currency === 'USD' && usdPrice !== undefined) {
      return `USD ${usdPrice.toFixed(2)}`;
    }
    return `CLP ${price.toLocaleString('es-CL')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 