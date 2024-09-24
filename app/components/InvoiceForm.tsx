'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import TaxModal from './TaxModal';
import { formatCurrency } from './currency';
import ImageUploader from './ImageUploader';
import InvoiceDocument from '@/app/components/InvoicePDF';
import currencySymbolMap from 'currency-symbol-map';
import InputField from '@/app/components/InputField';
import dynamic from 'next/dynamic';
import currencyCodes from 'currency-codes';

interface ItemData {
    qty: string;
    description: string;
    unitPrice: string;
    amount: string;
    taxName: string;
    taxPercentage: string;
    showTax: boolean;
}

interface InvoiceData {
    from: string;
    billTo: string;
    shipTo: string;
    invoiceNumber: string;
    invoiceDate: string;
    poNumber: string;
    DueDate: string;
    logo: string | null;
    items: ItemData[];
    showTax: boolean;
    dueDate?: string;
    subtotal: number;
    vat: number;
    total: number;
    vatPercentage: number;
    termsConditions: string;
    signature: string | null;
}

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const InvoiceForm: React.FC = () => {
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [vatPercentage, setVatPercentage] = useState(0.0);
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        from: '',
        billTo: '',
        shipTo: '',
        invoiceNumber: '',
        invoiceDate: '',
        poNumber: '',
        DueDate: '',
        logo: null,
        items: [
            {
                qty: '',
                description: '',
                unitPrice: '',
                amount: '',
                taxName: '',
                taxPercentage: '',
                showTax: false,
            },
        ],
        showTax: false,
        subtotal: 0,
        vat: 0,
        total: 0,
        vatPercentage: 0,
        termsConditions: '',
        signature: null,
    });

    const [termsConditions, setTermsConditions] = useState('');
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

    // Get the list of all currencies from currency-codes package
    const currencyList = currencyCodes.data.map((currency) => ({
        code: currency.code,
        name: currency.currency,
    }));

    // Calculate subtotal, VAT, and total
    const calculateTotals = () => {
        let subtotal = 0;
        let vat = 0;

        invoiceData.items.forEach((item) => {
            const amount = parseFloat(item.amount || '0');
            subtotal += amount;

            if (item.showTax) {
                const taxPercentage = parseFloat(item.taxPercentage || '0');
                vat += (taxPercentage / 100) * amount;
            }
        });

        setInvoiceData((prevData) => ({
            ...prevData,
            subtotal,
            vat,
            total: subtotal + vat,
            vatPercentage: vat > 0 && subtotal > 0 ? (vat / subtotal) * 100 : 0,
        }));
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceData.items, vatPercentage]);

    // Handle changes in item fields
    const handleItemChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [event.target.name as keyof ItemData]: event.target.value,
        };
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    // Handle changes in invoice data fields
    const handleInvoiceDataChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setInvoiceData({ ...invoiceData, [name]: value });
    };

    // Handle file uploads (logo and signature)
    const handleFileChangeOrDrop = (file: File | null, field: 'logo' | 'signature') => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setInvoiceData((prevData) => ({
                    ...prevData,
                    [field]: reader.result as string, // Base64 string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setInvoiceData((prevData) => ({ ...prevData, [field]: null }));
        }
    };

    // Modal Controls
    const openTaxModal = () => setIsTaxModalOpen(true);
    const closeTaxModal = () => setIsTaxModalOpen(false);

    // Save Tax Details from Modal
    const saveTaxDetails = (
        index: number,
        taxName: string,
        enteredTaxPercentage: string
    ) => {
        const taxPercentageValue = parseFloat(enteredTaxPercentage) || 0;

        setInvoiceData((prevData) => {
            const updatedItems = [...prevData.items];
            updatedItems[index] = {
                ...updatedItems[index],
                taxName,
                taxPercentage: enteredTaxPercentage,
                showTax: true,
            };
            return { ...prevData, items: updatedItems };
        });

        setVatPercentage(taxPercentageValue);
        calculateTotals();
    };

    // Remove an item from the invoice
    const removeItem = (index: number) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index),
        }));
    };

    // Add a new empty item
    const addNewItem = () => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [
                ...prevData.items,
                {
                    qty: '',
                    description: '',
                    unitPrice: '',
                    amount: '',
                    taxName: '',
                    taxPercentage: '',
                    showTax: false,
                },
            ],
        }));
    };

    // Handle currency change
    const handleCurrencyChange = (currencyCode: string): void => {
        setCurrency(currencyCode);
        const symbol = currencySymbolMap(currencyCode) || currencyCode;
        setCurrencySymbol(symbol);
    };

    return (
        <div>
            <div className="py-8 px-6 my-6 flex min-h-screen shadow-2xl rounded-2xl max-w-4xl flex-col mx-auto">
                {/* Header Section */ }
                <div className="flex flex-row space-x-4">
                    <div className="flex-1 mr-4">
                        {/* From Section */ }
                        <InputField
                            label="From"
                            name="from"
                            value={ invoiceData.from }
                            onChange={ handleInvoiceDataChange }
                            placeholder="Your company name or address"
                            rows={ 4 }
                            type="textarea"
                            style={ { maxWidth: '520px' } }
                        />
                    </div>

                    {/* Logo Section */ }
                    <div className="flex-none" style={ { maxWidth: '250px' } }>
                        <ImageUploader
                            label="Logo"
                            image={ invoiceData.logo }
                            onChange={ (file: File | null) => handleFileChangeOrDrop(file, 'logo') }
                            className="mb-4"
                        />
                    </div>
                </div>

                {/* Bill To and Ship To Section */ }
                <div className="flex flex-row">
                    <div className="flex-1">
                        {/* Bill To Section */ }
                        <InputField
                            label="Bill To"
                            name="billTo"
                            value={ invoiceData.billTo }
                            onChange={ handleInvoiceDataChange }
                            placeholder="Customer billing address"
                            rows={ 4 }
                            type="textarea"
                            style={ { maxWidth: '520px' } }
                        />

                        {/* Ship To Section */ }
                        <InputField
                            label="Ship To"
                            name="shipTo"
                            value={ invoiceData.shipTo }
                            onChange={ handleInvoiceDataChange }
                            placeholder="Customer shipping address (Optional)"
                            rows={ 4 }
                            type="textarea"
                            style={ { maxWidth: '520px' } }
                        />
                    </div>

                    {/* Invoice Information Section */ }
                    <div>
                        <InputField
                            label="Invoice #"
                            name="invoiceNumber"
                            value={ invoiceData.invoiceNumber }
                            onChange={ handleInvoiceDataChange }
                        />
                        <InputField
                            label="Invoice Date"
                            name="invoiceDate"
                            value={ invoiceData.invoiceDate }
                            onChange={ handleInvoiceDataChange }
                            type="date"
                        />
                        <InputField
                            label="PO #"
                            name="poNumber"
                            value={ invoiceData.poNumber }
                            onChange={ handleInvoiceDataChange }
                            placeholder="(Optional)"
                        />
                        <InputField
                            label="Due Date"
                            name="DueDate"
                            value={ invoiceData.DueDate }
                            onChange={ handleInvoiceDataChange }
                            type="date"
                        />
                    </div>
                </div>

                {/* Items Section */ }
                { invoiceData.items.map((item, index) => (
                    <div key={ index } className="flex flex-row space-x-4 mb-4">
                        <div className="flex-1">
                            <div className="flex flex-row items-center space-x-4">
                                <InputField
                                    label="Qty"
                                    name="qty"
                                    value={ item.qty }
                                    onChange={ (e) => handleItemChange(index, e) }
                                    className="flex-1"
                                />
                                <InputField
                                    label="Description"
                                    name="description"
                                    value={ item.description }
                                    onChange={ (e) => handleItemChange(index, e) }
                                    rows={ 2 }
                                    className="flex-2"
                                    style={ { resize: 'vertical' } }
                                />
                                <InputField
                                    label="Unit Price"
                                    name="unitPrice"
                                    value={ item.unitPrice }
                                    onChange={ (e) => handleItemChange(index, e) }
                                    className="flex-1"
                                />
                                <InputField
                                    label="Amount"
                                    name="amount"
                                    value={ item.amount }
                                    onChange={ (e) => handleItemChange(index, e) }
                                    className="flex-1"
                                />
                                <div className="flex-none">
                                    <button
                                        type="button"
                                        onClick={ () => openTaxModal() }
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                    >
                                        { item.taxName ? `${ item.taxName } ${ item.taxPercentage }%` : 'Add Tax' }
                                    </button>
                                </div>
                                <div className="flex-none">
                                    <button
                                        type="button"
                                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                        title="Remove Item"
                                        onClick={ () => removeItem(index) }
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) }

                {/* Add Item Button and Totals */ }
                <div className="flex flex-row justify-between mt-4 space-x-4">
                    {/* Add New Item Button */ }
                    <div className="flex flex-col space-y-4 flex-1">
                        <button
                            onClick={ addNewItem }
                            className="py-2 bg-light-navy-blue text-white rounded-md hover:bg-light-navy-blue-darker w-full"
                            style={ { backgroundColor: '#E0E6ED', color: '#1A1F36' } }
                        >
                            Add New Item
                        </button>
                    </div>

                    {/* Totals */ }
                    <div className="flex flex-col space-y-4 flex-1">
                        <div className="flex flex-col space-y-2 amount-details mt-4">
                            <div className="subtotal flex justify-between">
                                <span>Subtotal:</span>
                                <span className="ml-4">
                                    { formatCurrency(invoiceData.subtotal, currencySymbol) }
                                </span>
                            </div>

                            {/* Conditionally show VAT if vat > 0 */ }
                            <div
                                className="vat flex justify-between"
                                style={ { display: invoiceData.vat > 0 ? 'flex' : 'none' } }
                            >
                                <span>
                                    { invoiceData.items.some((item) => item.showTax)
                                        ? `VAT ${ invoiceData.vatPercentage.toFixed(2) }%`
                                        : '' }
                                    :
                                </span>
                                <span className="ml-4">{ formatCurrency(invoiceData.vat, currencySymbol) }</span>
                            </div>

                            {/* TOTAL section with aligned spacing */ }
                            <div className="total flex justify-between items-center">
                                {/* TOTAL with currency dropdown */ }
                                <div className="flex items-center space-x-2">
                                    <span className="flex-none">TOTAL: { currency }</span>

                                    {/* Currency Dropdown */}
                                    <div className="flex items-center space-x-2">
                                        <span className="flex-none">Currency:</span>
                                        <select
                                            className="px-1 py-0.5 text-xs max-w-20 bg-white border border-gray-300 rounded-md"
                                            value={currency}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleCurrencyChange(e.target.value)
                                            }
                                        >
                                            {currencyList.map((curr) => (
                                                <option key={curr.code} value={curr.code}>
                                                    {curr.code} - {curr.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Total Amount */ }
                                <span className="ml-4 flex-none">
                                    { currencySymbol }
                                    { formatCurrency(invoiceData.total, currencySymbol) }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions and Signature */ }
                <div className="mt-6">
                    <div className="flex flex-row justify-between mt-4">
                        <div className="terms flex-1 mr-4">
                            <InputField
                                label="Terms and Conditions"
                                name="termsConditions"
                                value={ termsConditions }
                                onChange={ (e) => setTermsConditions(e.target.value) }
                                placeholder="Terms and conditions"
                                rows={ 3 }
                                type="textarea"
                                style={ { maxWidth: '570px' } }
                            />
                        </div>
                        {/* Signature Section */ }
                        <div className="signature flex-2">
                            <ImageUploader
                                label="Signature"
                                image={ invoiceData.signature }
                                onChange={ (file: File | null) => handleFileChangeOrDrop(file, 'signature') }
                                className="mt-1"
                                style={ { maxWidth: '270px' } }
                            />
                        </div>
                    </div>

                    {/* Tax Modal */ }
                    <TaxModal
                        isOpen={ isTaxModalOpen }
                        onClose={ closeTaxModal }
                        onSave={ (taxName, taxPercentage) =>
                            saveTaxDetails(invoiceData.items.length - 1, taxName, taxPercentage)
                        }
                    />
                </div>
            </div>

            {/* Generate PDF Button */ }
            <div className="my-4 max-w-4xl justify-center flex mx-auto">
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
                    className="py-2 shadow-2xl bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full text-center"
                >
                    { ({ loading }) => (loading ? 'Generating PDF...' : 'Generate PDF') }
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default InvoiceForm;
