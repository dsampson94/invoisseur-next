// app/components/TaxCalculation.tsx
'use client';

import React, { useState } from 'react';

const TaxCalculation: React.FC = () => {
  const [taxRate, setTaxRate] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxRate(parseFloat(e.target.value));
  };

  const handleTotalTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalTax(parseFloat(e.target.value));
  };

  return (
    <div>
      <h2>Tax Calculation</h2>
      <div>
        <label>
          Tax Rate (%):
          <input
            type="number"
            placeholder="Enter Tax Rate (%)"
            value={taxRate}
            onChange={handleTaxRateChange}
          />
        </label>
      </div>
      <div>
        <label>
          Total Tax:
          <input
            type="number"
            placeholder="Enter Total Tax"
            value={totalTax}
            onChange={handleTotalTaxChange}
          />
        </label>
      </div>
      <div>
        <p><strong>Tax Rate:</strong> {taxRate}%</p>
        <p><strong>Total Tax:</strong> ${totalTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TaxCalculation;
