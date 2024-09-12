// currency.tsx
export interface Currency {
    code: string;
    symbol: string;
    name: string;
  }
  
  export const CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    // Add more currencies as needed
  ];
  
  export function formatCurrency(amount: number, currencyCode: string): string {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) {
      return amount.toFixed(2);
    }
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
  