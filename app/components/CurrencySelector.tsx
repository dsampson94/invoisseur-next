import React, { ChangeEvent } from 'react';

interface CurrencySelectorProps {
  currency: string;
  currencySymbol: string;
  onCurrencyChange: (currencyCode: string) => void;
  onSymbolChange: (symbol: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  currencySymbol,
  onCurrencyChange,
  onSymbolChange,
}) => {
  // Automatically updates symbol based on the selected currency
  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    onCurrencyChange(selectedCurrency);

    let symbol = '';
    switch (selectedCurrency) {
      case 'USD':
        symbol = '$';
        break;
      case 'EUR':
        symbol = '€';
        break;
      case 'GBP':
        symbol = '£';
        break;
      case 'ZAR':
        symbol = 'R';
        break;
      default:
        symbol = selectedCurrency; 
    }

    onSymbolChange(symbol); 
  };

  const handleSymbolChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSymbolChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="currency">Currency:</label>
      <select id="currency" value={currency} onChange={handleCurrencyChange}>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
        <option value="ZAR">ZAR (R)</option>
        {/* Add other currencies as needed */}
      </select>

      <label htmlFor="currencySymbol">Currency Symbol:</label>
      <input
        type="text"
        id="currencySymbol"
        value={currencySymbol}
        onChange={handleSymbolChange}
        placeholder="Currency Symbol"
      />
    </div>
  );
};

export default CurrencySelector;
