// app/components/Header.tsx

import React from 'react';

// Header Component
// This functional component renders the header section of the application,
// displaying the application name prominently.

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 text-center">
      {/* Application title displayed in the header */}
      <h1 className="text-3xl font-bold">Invoisseur Next</h1>
    </header>
  );
};

export default Header;
