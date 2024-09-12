// app/components/Footer.tsx

import React from 'react';

// Footer Component
// This functional component renders a footer section with copyright information
// and a link to the hosting platform.

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      {/* Copyright notice for the application */}
      <p>&copy; 2024 Invoice Maker. All rights reserved.</p>
      
      {/* Link to the hosting platform (Vercel) */}
      <a
        href="https://vercel.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300"
      >
        Hosted on Vercel
      </a>
    </footer>
  );
};

export default Footer;
