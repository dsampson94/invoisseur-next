// app/components/ClientInfo.tsx

import React from 'react';

// ClientInfo Component
// This functional component renders a section of a form dedicated to capturing client information.
// It includes fields for the client’s name, address, and email address.

const ClientInfo: React.FC = () => {
  return (
    <div>
      {/* 
        Title of the section that displays "Client Information". 
        This provides a clear heading for users to understand the purpose of the form.
      */}
      <h2>Client Information</h2>
      
      {/* 
        Input field for entering the client's name. 
        Placeholder text "Client Name" guides the user on what information should be entered.
        Consider adding validations and state management for handling the input value.
      */}
      <input 
        type="text" 
        placeholder="Client Name" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
      
      {/* 
        Input field for entering the client's address. 
        Placeholder text "Client Address" guides the user on what information should be entered.
        Consider adding validations and state management for handling the input value.
      */}
      <input 
        type="text" 
        placeholder="Client Address" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
      
      {/* 
        Input field for entering the client's email address. 
        Placeholder text "Client Email" guides the user on what information should be entered.
        The type "email" helps with basic validation of email format.
        Consider adding additional validation or state management for handling the input value.
      */}
      <input 
        type="email" 
        placeholder="Client Email" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
    </div>
  );
};

export default ClientInfo;
