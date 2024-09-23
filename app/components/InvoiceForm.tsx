'use client';
import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import TaxModal from './TaxModal';
import SavedItemsModal from './SavedItemsModal';
import { formatCurrency } from './currency';
import Signature from './Signature';

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
    logo: File | null;
    items: ItemData[];
    showTax: boolean;
    dueDate?: string;
}

const InvoiceForm: React.FC = () => {
    const [currency, setCurrency] = useState('ZAR');
    const [currencySymbol, setCurrencySymbol] = useState('R');
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
    });

    const [subtotal, setSubtotal] = useState(0);
    const [vat, setVat] = useState(0);
    const [total, setTotal] = useState(0);
    const [termsConditions, setTermsConditions] = useState('');
    const [signature, setSignature] = useState<File | null>(null);
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [isSavedItemsModalOpen, setIsSavedItemsModalOpen] = useState(false);
    const [savedItems, setSavedItems] = useState<ItemData[]>([]);

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

        setSubtotal(subtotal);
        setVat(vat);
        setTotal(subtotal + vat);
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceData.items, vatPercentage]);

    const handleChange = (
        index: number,
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [event.target.name as keyof ItemData]: event.target.value,
        };
        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    const handleFileChangeOrDrop = (file: File | null) => {
        setInvoiceData((prevData) => ({ ...prevData, logo: file }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFileChangeOrDrop(event.target.files?.[0] || null);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFileChangeOrDrop(event.dataTransfer.files?.[0] || null);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const openTaxModal = () => setIsTaxModalOpen(true);
    const closeTaxModal = () => setIsTaxModalOpen(false);

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

    const removeItem = (index: number) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index),
        }));
    };

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

    const openSavedItemsModal = () => {
        const savedItems: ItemData[] = Object.keys(localStorage)
            .filter((key) => key.startsWith('savedItem_'))
            .map((key) => {
                const itemString = localStorage.getItem(key);
                if (itemString) {
                    try {
                        return JSON.parse(itemString);
                    } catch (e) {
                        console.error(`Failed to parse JSON for key ${ key }:`, e);
                        return null;
                    }
                }
                return null;
            })
            .filter((item): item is ItemData => item !== null && !!item.description);

        setSavedItems(savedItems);
        setIsSavedItemsModalOpen(true);
    };

    const closeSavedItemsModal = () => setIsSavedItemsModalOpen(false);

    const addSavedItems = (items: ItemData[]) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [...prevData.items, ...items],
        }));
    };

    const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSignature(file);
    };

    const saveCurrentItem = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const currentItem = invoiceData.items[0];
        localStorage.setItem(`savedItem_${ Date.now() }`, JSON.stringify(currentItem));
        alert('Item saved successfully');
    };

    const handleCurrencyChange = (currencyCode: string): void => {
        setCurrency(currencyCode);
        let symbol = '';

        switch (currencyCode) {
            case 'USD':
                symbol = '$';
                break;
            case 'EUR':
                symbol = '€';
                break;
            case 'GBP':
                symbol = '£';
                break;
            case 'ZAR':
                symbol = 'R';
                break;
            default:
                symbol = currencyCode;
        }

        setCurrencySymbol(symbol);
    };

    const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const generatePDF = async () => {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);
            const { width, height } = page.getSize();

            let yOffset = height - 50;

            const drawMultilineText = (text: string, x: number, y: number) => {
                const lines = text.split('\n');
                lines.forEach((line, index) => {
                    page.drawText(line, { x, y: y - index * 15, size: 12, color: rgb(0, 0, 0) });
                });
            };

            const embedImage = async (file: File) => {
                const arrayBuffer = await fileToArrayBuffer(file);
                const fileType = file.type;
                if (fileType === 'image/png') {
                    return pdfDoc.embedPng(arrayBuffer);
                } else if (fileType === 'image/jpeg') {
                    return pdfDoc.embedJpg(arrayBuffer);
                } else {
                    throw new Error('Unsupported image format. Only PNG and JPEG are allowed.');
                }
            };

            if (invoiceData.logo instanceof File) {
                const logoImage = await embedImage(invoiceData.logo);
                page.drawImage(logoImage, {
                    x: width - 165,
                    y: yOffset - 80,
                    width: 100,
                    height: 50,
                });
            }


            page.drawText('From:', { x: 50, y: yOffset - 50, size: 12, color: rgb(0, 0, 0) });
            drawMultilineText(invoiceData.from, 50, yOffset - 70);

            yOffset -= 180;

            page.drawText('Invoice #:', { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
            page.drawText(invoiceData.invoiceNumber, { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });

            page.drawText('Invoice Date:', { x: 300, y: yOffset - 20, size: 12, color: rgb(0, 0, 0) });
            page.drawText(invoiceData.invoiceDate, { x: 450, y: yOffset - 20, size: 12, color: rgb(0, 0, 0) });

            yOffset -= 40;
            page.drawText('Due Date:', { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
            page.drawText(invoiceData.DueDate || 'N/A', { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });


            page.drawText('Bill To:', { x: 50, y: yOffset + 40, size: 12, color: rgb(0, 0, 0) });
            drawMultilineText(invoiceData.billTo, 50, yOffset + 20);

            yOffset -= 40;

            const labelWidth = 100;
            const spaceBetween = 20;

            if (invoiceData.shipTo && invoiceData.shipTo.trim() !== '') {

                page.drawText('Ship To:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
                drawMultilineText(invoiceData.shipTo, 50, yOffset - 20);

                if (invoiceData.poNumber && invoiceData.poNumber.trim() !== '') {
                    page.drawText('P.O. #: ', {
                        x: 300,
                        y: yOffset,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });

                    page.drawText(invoiceData.poNumber, {
                        x: 330 + labelWidth + spaceBetween,
                        y: yOffset,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                }


                yOffset -= 50;
            }

            yOffset -= 20;

            page.drawText('Qty', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
            page.drawText('Description', { x: 100, y: yOffset, size: 12, color: rgb(0, 0, 0) });
            page.drawText('Unit Price', { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
            page.drawText('Amount', { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });

            yOffset -= 30;

            const amountX = 450;
            const labelX = 300;
            const labelPadding = 15;

            invoiceData.items.forEach(item => {
                page.drawText(item.qty, { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
                drawMultilineText(item.description, 100, yOffset);
                page.drawText(item.unitPrice, { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
                page.drawText(item.amount, { x: amountX, y: yOffset, size: 12, color: rgb(0, 0, 0) });

                yOffset -= 50;
            });

            yOffset -= 20;

            const textSize = 12;


            page.drawText(`Subtotal:`, { x: labelX, y: yOffset, size: textSize, color: rgb(0, 0, 0) });
            page.drawText(`${ formatCurrency(subtotal, currency) }`, {
                x: amountX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0)
            });
            yOffset -= 40;

            if (vat > 0) {
                page.drawText(`VAT (${ vatPercentage }%):`, {
                    x: labelX,
                    y: yOffset,
                    size: textSize,
                    color: rgb(0, 0, 0)
                });
                page.drawText(`${ formatCurrency(vat, currency) }`, {
                    x: amountX,
                    y: yOffset,
                    size: textSize,
                    color: rgb(0, 0, 0)
                });
                yOffset -= 40;
            }

            page.drawText(`Total:`, { x: labelX, y: yOffset, size: textSize, color: rgb(0, 0, 0) });
            page.drawText(`${ currencySymbol }${ formatCurrency(total, currency) }`, {
                x: amountX,
                y: yOffset,
                size: textSize,
                color: rgb(0, 0, 0)
            });

            yOffset -= 80;


            const signatureY = yOffset;

            if (signature instanceof File) {
                const signatureImage = await embedImage(signature);
                page.drawImage(signatureImage, {
                    x: amountX - 100,
                    y: signatureY - 50,
                    width: 100,
                    height: 50,
                });
            }

            yOffset -= 70;

            if (termsConditions) {
                const margin = 50;
                const termsHeight = 15 * Math.min(termsConditions.split('\n').length, 10);
                const termsY = yOffset;

                page.drawText('Terms and Conditions:', { x: margin, y: termsY, size: 12, color: rgb(0, 0, 0) });
                yOffset = termsY - 20;

                const termsLines = termsConditions.split('\n');
                termsLines.forEach((line, index) => {
                    page.drawText(line, { x: margin, y: yOffset - (index * 15), size: 12, color: rgb(0, 0, 0) });
                });
                yOffset -= (termsLines.length * 15);
            } else {
                yOffset -= 20;
            }

            yOffset = Math.min(signatureY - 60, yOffset);
            yOffset = Math.min(signatureY - 60, yOffset);
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="py-8 px-6 my-6 flex min-h-screen shadow-2xl max-w-4xl flex-col mx-auto">
            <div className="flex flex-row space-x-4">
                <div className="flex-1 mr-4">
                    {/* From Section */ }
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">From</label>
                        <textarea
                            name="from"
                            value={ invoiceData.from }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, from: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            placeholder="Your company name or address"
                            style={ { height: '100px', resize: 'none', maxWidth: '570px' } }
                        />
                    </div>
                </div>

                {/* Logo Section */ }
                <div className="flex-none" style={ { maxWidth: '250px' } }>
                    <div
                        className="border border-gray-300 rounded-md p-4 text-center mb-4"
                        onDrop={ handleDrop }
                        onDragOver={ handleDragOver }
                    >
                        <label className="block text-sm font-medium text-gray-700">Logo</label>
                        <input
                            type="file"
                            accept="image/png"
                            onChange={ handleFileChange }
                            className="mt-2"
                        />
                        <p className="mt-2 text-gray-500">Drag and drop a PNG file or click to select one.</p>
                    </div>
                </div>
            </div>

            {/* Other sections remain the same */ }
            <div className="flex flex-row space-x-4">
                <div className="flex-1 mr-4">
                    {/* Bill To Section */ }
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Bill To</label>
                        <textarea
                            name="billTo"
                            value={ invoiceData.billTo }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, billTo: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            placeholder="Customer billing address"
                            style={ { height: '100px', resize: 'none', maxWidth: '570px' } }
                        />
                    </div>

                    {/* Ship To Section */ }
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Ship To</label>
                        <textarea
                            name="shipTo"
                            value={ invoiceData.shipTo }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, shipTo: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            placeholder="Customer shipping address(Optional)"
                            style={ { height: '100px', resize: 'none', maxWidth: '570px' } }
                        />
                    </div>
                </div>

                <div className="flex-none w-1/4">
                    {/* Invoice Information */ }
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Invoice #</label>
                        <input
                            type="text"
                            name="invoiceNumber"
                            value={ invoiceData.invoiceNumber }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                        <input
                            type="date"
                            name="invoiceDate"
                            value={ invoiceData.invoiceDate }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">PO #</label>
                        <input
                            type="text"
                            name="poNumber"
                            value={ invoiceData.poNumber }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, poNumber: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            placeholder="(Optional)"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            name="invoiceDueDate"
                            value={ invoiceData.DueDate }
                            onChange={ (e) => setInvoiceData({ ...invoiceData, DueDate: e.target.value }) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
            </div>

            { invoiceData.items.map((item, index) => (
                <div key={ index } className="flex flex-row space-x-4 mb-4">
                    <div className="flex-1">
                        <div className="flex flex-row items-center space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Qty</label>
                                <input
                                    type="text"
                                    name="qty"
                                    value={ item.qty }
                                    onChange={ (e) => handleChange(index, e) }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="flex-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={ item.description }
                                    onChange={ (e) => handleChange(index, e) }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                    style={ { height: '50px', resize: 'vertical' } }
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                                <input
                                    type="text"
                                    name="unitPrice"
                                    value={ item.unitPrice }
                                    onChange={ (e) => handleChange(index, e) }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={ item.amount }
                                    onChange={ (e) => handleChange(index, e) }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
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

            {/* Add Item Buttons and Total */ }
            <div className="flex flex-row justify-between mt-4 space-x-4">
                {/* Add New Item Button */ }
                <div className="flex flex-col space-y-4 flex-1">
                    <button
                        onClick={ addNewItem }
                        className="py-2 bg-light-navy-blue text-white rounded-md hover:bg-light-navy-blue-darker w-full"
                        style={ { backgroundColor: '#E0E6ED', color: '#1A1F36' } } // Light navy blue
                    >
                        Add New Item
                    </button>
                </div>

                {/* Add Saved Items Button */ }
                <div className="flex flex-col space-y-4 flex-1">
                    <button
                        onClick={ openSavedItemsModal }
                        className="py-2 bg-light-navy-blue text-white rounded-md hover:bg-light-navy-blue-darker w-full"
                        style={ { backgroundColor: '#E0E6ED', color: '#1A1F36' } } // Light navy blue
                    >
                        Add Saved Items
                    </button>

                    {/* Total section under the "Add Saved Items" button */ }
                    <div className="flex flex-col space-y-2 amount-details mt-4">
                        <div className="subtotal flex justify-between">
                            <span>Subtotal:</span>
                            <span className="ml-4">{ formatCurrency(subtotal, currencySymbol) }</span>
                        </div>

                        {/* Conditionally show VAT if vat > 0 */ }
                        <div className="vat flex justify-between" style={ { display: vat > 0 ? 'flex' : 'none' } }>
                            <span>{ invoiceData.items.some(item => item.showTax) ? `VAT ${ vatPercentage }%` : '' }:</span>
                            <span className="ml-4">{ formatCurrency(vat, currencySymbol) }</span>
                        </div>

                        {/* Adjusted TOTAL section with aligned spacing */ }
                        <div className="total flex justify-between items-center">
                            {/* TOTAL:ZAR with edit dropdown immediately after */ }
                            <div className="flex items-center space-x-2">
                                <span className="flex-none">TOTAL: { currency }</span>

                                {/* Smaller Currency Dropdown placed right next to TOTAL:ZAR */ }
                                <select
                                    className="px-1 py-0.5 text-xs bg-white border border-gray-300 rounded-md"
                                    value={ currency }
                                    onChange={ (e) => handleCurrencyChange(e.target.value) }
                                >
                                    <option value="ZAR">ZAR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>

                            {/* 0.00 with currency symbol aligned normally */ }
                            <span className="ml-4 flex-none">
                                { currencySymbol }{ formatCurrency(total, currencySymbol) }
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {/* Terms and Conditions Section */ }
                <div className="flex flex-row justify-between mt-4">
                    <div className="terms flex-1 mr-4">
                        <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
                        <textarea
                            placeholder="Terms and conditions"
                            value={ termsConditions }
                            onChange={ (e) => setTermsConditions(e.target.value) }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            style={ { height: '100px', resize: 'none', maxWidth: '570px' } }
                        />
                    </div>
                    {/* Signature Section */ }
                    <div className="signature flex-2">
                        <label className="block text-sm font-medium text-gray-700">Signature</label>

                        {/* Updated Signature Component */ }
                        <Signature
                            signature={ signature }
                            onChange={ handleSignatureChange }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                            style={ { height: '100px', maxWidth: '270px' } }
                        />

                        {/* Generate PDF Button */ }
                        <div className="mt-4">
                            <button
                                onClick={ generatePDF }
                                className="py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 w-full"
                            >
                                Generate PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Item Button */ }
                <div className="flex mt-4">
                    <button
                        onClick={ saveCurrentItem }
                        className="py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                    >
                        Save Item
                    </button>
                </div>

                {/* Tax and Saved Items Modal */ }
                <TaxModal
                    isOpen={ isTaxModalOpen }
                    onClose={ closeTaxModal }
                    onSave={ (taxName, taxPercentage) => saveTaxDetails(invoiceData.items.length - 1, taxName, taxPercentage) }
                />
                <SavedItemsModal
                    isOpen={ isSavedItemsModalOpen }
                    onClose={ closeSavedItemsModal }
                    onSelectItems={ addSavedItems }
                    savedItems={ savedItems }
                />
            </div>
        </div>
    );
};

export default InvoiceForm;
