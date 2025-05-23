import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Currency = 'CLP' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, usdPrice?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('CLP');

  const formatPrice = useCallback((price: number, usdPrice?: number): string => {
    if (currency === 'USD' && usdPrice !== undefined) {
      return `USD ${usdPrice.toFixed(2)}`;
    }
    return `CLP ${price.toLocaleString('es-CL')}`;
  }, [currency]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    // Guardar la preferencia en localStorage
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  // Cargar la preferencia de moneda al iniciar
  React.useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency;
    if (savedCurrency && (savedCurrency === 'CLP' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: handleCurrencyChange, 
      formatPrice 
    }}>
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