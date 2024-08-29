// app/components/CompanyInfo.tsx

import React from 'react';

// CompanyInfo Component
// This functional component renders a section of a form dedicated to capturing company information.
// It includes fields for the company's name, address, and contact details.

const CompanyInfo: React.FC = () => {
  return (
    <div>
      {/* 
        Header for the Company Information section. 
        This heading clearly indicates the purpose of the form fields below.
      */}
      <h2>Company Information</h2>
      
      {/* 
        Input field for entering the company's name. 
        Placeholder text "Company Name" provides guidance on what information should be entered.
        Additional features such as validation and state management can be implemented as needed.
      */}
      <input 
        type="text" 
        placeholder="Company Name" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
      
      {/* 
        Input field for entering the company's address. 
        Placeholder text "Company Address" helps users understand the required information.
        Consider adding validations and state management for handling the input value.
      */}
      <input 
        type="text" 
        placeholder="Company Address" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
      
      {/* 
        Input field for entering the company's contact details. 
        Placeholder text "Company Contact Details" guides users on the type of information to provide.
        The field can be used for phone numbers, email addresses, or other contact information.
        Consider adding additional validation or state management as needed.
      */}
      <input 
        type="text" 
        placeholder="Company Contact Details" 
        // Additional props (e.g., value, onChange) and validations can be added here
      />
    </div>
  );
};

export default CompanyInfo;
