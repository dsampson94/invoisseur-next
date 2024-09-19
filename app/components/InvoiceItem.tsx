import React from 'react';

// Props interface to define the structure of the invoice item
interface InvoiceItemProps {
  name: string;  
  description: string;  
  amount: number; 
}

// Functional component to render individual invoice items
const InvoiceItem: React.FC<InvoiceItemProps> = ({ name, description, amount }) => {
  return (
    <div className="invoice-item">
      {/* Display the name of the item */}
      <span className="item-name">{name}</span>
      {/* Display the description of the item */}
      <span className="item-description">{description}</span>
      {/* Display the amount formatted to two decimal places */}
      <span className="item-amount">${amount.toFixed(2)}</span>
    </div>
  );
};

export default InvoiceItem;
