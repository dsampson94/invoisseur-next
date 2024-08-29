// app/components/InvoiceList.tsx

import React from 'react';

// Interface defining the structure of an invoice object
interface Invoice {
  number: string;  // Invoice number identifier
  total: number;   // Total amount of the invoice
  clientName: string;  // Name of the client associated with the invoice
}

// Props interface for the InvoiceList component, accepting an array of invoices
interface InvoiceListProps {
  invoices: Invoice[];  // Array of invoice objects
}

// Functional component to render a list of invoices
const InvoiceList: React.FC<InvoiceListProps> = ({ invoices = [] }) => {
  return (
    <div>
      <h2>Invoice List</h2>
      {invoices.length > 0 ? (
        invoices.map((invoice) => (
          <div key={invoice.number}>
            <span>Invoice Number: {invoice.number} - Total: ${invoice.total}</span>
            <span> - Client: {invoice.clientName}</span>
          </div>
        ))
      ) : (
        <p>No invoices available.</p>
      )}
    </div>
  );
};

export default InvoiceList;
