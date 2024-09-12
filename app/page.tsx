// app/page.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InvoiceForm from './components/InvoiceForm';

const Page = () => {
  return (
    <div className="app-container">
      <Header />
      
      <main>
        <section>
          
          <InvoiceForm />

        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Page;
