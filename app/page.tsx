// app/page.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InvoiceForm from './components/invoice/InvoiceForm';
import { Analytics } from '@vercel/analytics/react';

const Page = () => {
    return (
        <div className="app-container">
            <Header/>
            <main>
                <section>
                    <InvoiceForm/>
                </section>
            </main>
            <Footer/>
            <Analytics/>
        </div>
    );
};

export default Page;
