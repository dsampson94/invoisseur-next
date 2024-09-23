import React from 'react';

interface InvoiceItemProps {
  name: string;  
  description: string;  
  amount: number; 
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ name, description, amount }) => {
  return (
    <div className="invoice-item">
      <span className="item-name">{name}</span>
      <span className="item-description">{description}</span>
      <span className="item-amount">${amount.toFixed(2)}</span>
    </div>
  );
};

export default InvoiceItem;
