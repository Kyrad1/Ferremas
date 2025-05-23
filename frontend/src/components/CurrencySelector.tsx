import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency" className="text-sm font-medium text-gray-700">
        Moneda:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as 'CLP' | 'USD')}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      >
        <option value="CLP">CLP</option>
        <option value="USD">USD</option>
      </select>
    </div>
  );
}; 