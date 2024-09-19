import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 text-center flex items-center justify-center">
      <img
        src="path/to/logo.png" // Replace with the path to your logo image
        className="h-10 w-auto mr-4" // Adjust the size of the logo
      />
      <div>
        <h1 className="text-3xl font-bold">Invoisseur</h1>
      </div>
    </header>
  );
};

export default Header;
