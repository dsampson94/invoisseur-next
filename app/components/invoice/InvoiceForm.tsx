// InvoiceForm.tsx

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import InvoiceFromSection from './InvoiceFromSection';
import InvoiceToSection from './InvoiceToSection';
import InvoiceItems from './InvoiceItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceBankDetails from './InvoiceBankDetails';

import { useInvoiceForm } from '@/app/hooks/useInvoiceForm';
import InvoiceDocument from '@/app/components/invoice/InvoiceDocument';
import InputField from '@/app/components/invoice/InputField';
import ImageUploader from '@/app/components/invoice/ImageUploader';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const PDFViewer = dynamic(
    () =>
        import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

const InvoiceForm: React.FC = () => {
    const {
        currency,
        currencySymbol,
        invoiceData,
        termsConditions,
        currencyList,
        setTermsConditions,
        handleItemChange,
        handleInvoiceDataChange,
        handleTopLevelChange,
        handleFileChangeOrDrop,
        removeItem,
        addNewItem,
        handleCurrencyChange,
    } = useInvoiceForm();

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Left Side: Invoice Form */ }
            <div className="p-4 flex flex-col mx-auto lg:w-1/2">
                {/* Invoice Info */ }
                <div className="flex flex-row space-x-2">
                    <div className="flex flex-col space-y-2 w-1/2">
                        <h3 className="text-xl font-bold mb-2">DETAILS:</h3>
                        <InputField
                            label="Invoice Date"
                            name="invoiceDate"
                            type="date"
                            value={ invoiceData.invoiceDate || '' }
                            onChange={ (e) => handleTopLevelChange('invoiceDate', e.target.value) }
                        />
                        <InputField
                            label="Invoice Number"
                            name="invoiceNumber"
                            value={ invoiceData.invoiceNumber || '' }
                            onChange={ (e) => handleTopLevelChange('invoiceNumber', e.target.value) }
                        />
                    </div>

                    {/* Logo Section */ }
                    <ImageUploader
                        label="Logo"
                        image={ invoiceData.logo }
                        onChange={ (file) => handleFileChangeOrDrop(file, 'logo') }
                    />
                </div>

                {/* Header Section */ }
                <div className="flex flex-row space-x-2">
                    <InvoiceFromSection
                        from={ invoiceData.from }
                        onFromChange={ handleInvoiceDataChange }
                    />

                    {/* TO Section */ }
                    <InvoiceToSection
                        to={ invoiceData.to }
                        onToChange={ handleInvoiceDataChange }
                    />
                </div>

                {/* Items Section */ }
                <InvoiceItems
                    items={ invoiceData.items }
                    onItemChange={ handleItemChange }
                    onRemoveItem={ removeItem }
                    onAddNewItem={ addNewItem }
                />

                {/* Totals Section */ }
                <InvoiceTotals
                    subtotal={ invoiceData.subtotal }
                    total={ invoiceData.total }
                    currency={ currency }
                    currencySymbol={ currencySymbol }
                    currencyList={ currencyList }
                    onCurrencyChange={ handleCurrencyChange }
                />

                {/* Banking Details Section */ }
                <InvoiceBankDetails
                    bankDetails={ invoiceData.bankDetails }
                    onBankDetailsChange={ handleInvoiceDataChange }
                />

                {/* Terms and Conditions */ }
                <div className="mt-4">
                    <InputField
                        label="Terms and Conditions"
                        name="termsConditions"
                        value={ termsConditions }
                        onChange={ (e) => setTermsConditions(e.target.value) }
                        type="textarea"
                        rows={ 4 }
                    />
                </div>

                {/* Generate PDF Button */ }
                <div className="my-4 flex justify-center">
                    <PDFDownloadLink
                        document={
                            <InvoiceDocument
                                invoiceData={ {
                                    ...invoiceData,
                                    termsConditions,
                                } }
                            />
                        }
                        fileName={ `invoice_${ invoiceData.invoiceNumber || Date.now() }.pdf` }
                        className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full text-center"
                    >
                        { ({ loading }) => (loading ? 'Generating PDF...' : 'Generate PDF') }
                    </PDFDownloadLink>
                </div>
            </div>

            {/* Right Side: Live Invoice Preview */ }
            <div className="py-8 px-6 my-6 flex shadow-2xl rounded-2xl mx-auto lg:w-1/2">
                <PDFViewer width="100%" height="1000">
                    <InvoiceDocument
                        invoiceData={ {
                            ...invoiceData,
                            termsConditions,
                        } }
                    />
                </PDFViewer>
            </div>
        </div>
    );
};

export default InvoiceForm;
