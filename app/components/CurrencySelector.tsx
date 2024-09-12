// CurrencySelector.tsx
import React from 'react';
import { CURRENCIES, Currency } from './currency';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currencyCode: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Currency</label>
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
      >
        {CURRENCIES.map((currency: Currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
