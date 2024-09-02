import React from 'react';

const ClientInfo: React.FC = () => {
  return (
    <div>
      <h2>Client Information</h2>
      <input 
        type="text" 
        placeholder="Client Name" 
      />
      <input 
        type="text" 
        placeholder="Client Address" 
      />
      <input 
        type="email" 
        placeholder="Client Email" 
      />
    </div>
  );
};

export default ClientInfo;