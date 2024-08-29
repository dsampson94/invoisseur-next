import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import ClientInfo from './components/ClientInfo';
import CompanyInfo from './components/CompanyInfo';
import PaymentTerms from './components/PaymentTerms';
import TaxCalculation from './components/TaxCalculation';

/**
 * Page Component
 * This component serves as the main layout and entry point for the Invoisseur Next application.
 * It combines various sections, such as the header, footer, and multiple forms and lists for handling invoices.
 */
const Page = () => {
  return (
    <div className="app-container">
      {/* Header Component: Displays the page header, including navigation or branding */}
      <Header />
      
      <main>
        <section>
          {/* Main Title */}
          <h1>Welcome to Invoisseur Next</h1>
          
          {/* InvoiceForm Component: Form for creating and managing invoices */}
          <InvoiceForm />
          
          {/* ClientInfo Component: Form for entering client information */}
          <ClientInfo />
          
          {/* CompanyInfo Component: Form for entering company information */}
          <CompanyInfo />
          
          {/* PaymentTerms Component: Section for specifying payment terms and conditions */}
          <PaymentTerms />
          
          {/* TaxCalculation Component: Section for calculating tax rates and totals */}
          <TaxCalculation />
          
          {/* InvoiceList Component: Displays a list of current invoices (Pass actual invoice data as props) */}
          <InvoiceList invoices={[]} />
        </section>
      </main>
      
      {/* Footer Component: Displays the page footer with any additional information or links */}
      <Footer />
    </div>
  );
};

export default Page;
