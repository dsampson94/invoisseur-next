'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import TaxModal from './TaxModal';
import InvoiceDocument from '@/app/components/invoice/InvoicePDF';
import InvoiceHeader from './InvoiceHeader';
import InvoiceAddresses from './InvoiceAddresses';
import InvoiceInfo from './InvoiceInfo';
import InvoiceItems from './InvoiceItems';
import InvoiceTotals from './InvoiceTotals';
import InvoiceTermsAndSignature from './InvoiceTermsAndSignature';

import { useInvoiceForm } from '@/app/hooks/useInvoiceForm';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const InvoiceForm: React.FC = () => {
    const {
        currency,
        currencySymbol,
        invoiceData,
        termsConditions,
        isTaxModalOpen,
        currentItemIndex,
        currencyList,
        setTermsConditions,
        openTaxModal,
        closeTaxModal,
        handleItemChange,
        handleInvoiceDataChange,
        handleFileChangeOrDrop,
        saveTaxDetails,
        removeItem,
        addNewItem,
        handleCurrencyChange,
    } = useInvoiceForm();

    return (
        <div>
            <div className="py-8 px-6 my-6 flex min-h-screen shadow-2xl rounded-2xl max-w-4xl flex-col mx-auto">
                {/* Header Section */}
                <InvoiceHeader
                    from={invoiceData.from}
                    onFromChange={handleInvoiceDataChange}
                    logo={invoiceData.logo}
                    onLogoChange={(file) => handleFileChangeOrDrop(file, 'logo')}
                />

                {/* Addresses and Invoice Info */}
                <div className="flex flex-row">
                    <InvoiceAddresses
                        billTo={invoiceData.billTo}
                        shipTo={invoiceData.shipTo}
                        onBillToChange={handleInvoiceDataChange}
                        onShipToChange={handleInvoiceDataChange}
                    />
                    <InvoiceInfo
                        invoiceNumber={invoiceData.invoiceNumber}
                        invoiceDate={invoiceData.invoiceDate}
                        poNumber={invoiceData.poNumber}
                        dueDate={invoiceData.DueDate}
                        onInvoiceNumberChange={handleInvoiceDataChange}
                        onInvoiceDateChange={handleInvoiceDataChange}
                        onPoNumberChange={handleInvoiceDataChange}
                        onDueDateChange={handleInvoiceDataChange}
                    />
                </div>

                {/* Items Section */}
                <InvoiceItems
                    items={invoiceData.items}
                    onItemChange={handleItemChange}
                    onOpenTaxModal={openTaxModal}
                    onRemoveItem={removeItem}
                    onAddNewItem={addNewItem}
                />

                {/* Totals Section */}
                <div className="flex flex-row justify-between mt-4 space-x-4">
                    <InvoiceTotals
                        subtotal={invoiceData.subtotal}
                        vat={invoiceData.vat}
                        total={invoiceData.total}
                        vatPercentage={invoiceData.vatPercentage}
                        currency={currency}
                        currencySymbol={currencySymbol}
                        currencyList={currencyList}
                        onCurrencyChange={handleCurrencyChange}
                        items={invoiceData.items}
                    />
                </div>

                {/* Terms and Signature Section */}
                <InvoiceTermsAndSignature
                    termsConditions={termsConditions}
                    onTermsConditionsChange={(e) => setTermsConditions(e.target.value)}
                    signature={invoiceData.signature}
                    onSignatureChange={(file) => handleFileChangeOrDrop(file, 'signature')}
                />

                {/* Tax Modal */}
                {currentItemIndex !== null && (
                    <TaxModal
                        isOpen={isTaxModalOpen}
                        onClose={closeTaxModal}
                        onSave={(taxName, taxPercentage) =>
                            saveTaxDetails(currentItemIndex, taxName, taxPercentage)
                        }
                    />
                )}
            </div>

            {/* Generate PDF Button */}
            <div className="my-4 max-w-4xl justify-center flex mx-auto">
                <PDFDownloadLink
                    document={
                        <InvoiceDocument
                            invoiceData={{
                                ...invoiceData,
                                termsConditions,
                            }}
                        />
                    }
                    fileName={`invoice_${invoiceData.invoiceNumber || Date.now()}.pdf`}
                    className="py-2 shadow-2xl bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full text-center"
                >
                    {({ loading }) => (loading ? 'Generating PDF...' : 'Generate PDF')}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default InvoiceForm;
