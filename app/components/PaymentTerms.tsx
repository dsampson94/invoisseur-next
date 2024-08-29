import React from 'react';

// PaymentTerms Component
// This functional component allows users to specify payment terms for an invoice, including the due date, late fee, and terms and conditions.
const PaymentTerms: React.FC = () => {
  return (
    <div>
      {/* Section title */}
      <h2>Payment Terms</h2>
      
      {/* Input for specifying the payment due date */}
      <input type="date" placeholder="Payment Due Date" />

      {/* Input for specifying the late fee, if applicable */}
      <input type="number" placeholder="Late Fee" />

      {/* Text area for entering detailed terms and conditions */}
      <textarea placeholder="Terms and Conditions"></textarea>
    </div>
  );
};

export default PaymentTerms;
