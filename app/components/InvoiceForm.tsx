"use client";

import React, { useState, ChangeEvent, DragEvent } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

interface InvoiceData {
  from: string;
  billTo: string;
  shipTo: string;
  invoiceNumber: string;
  invoiceDate: string;
  poNumber: string;
  invoiceDueDate: string;
  logo: Uint8Array | null;
  qty: string;
  description: string;
  unitPrice: string;
  amount: string;
  tax: string;
  showTax: boolean;
}

const InvoiceComponent: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    from: '',
    billTo: '',
    shipTo: '',
    invoiceNumber: '',
    invoiceDate: '',
    poNumber: '',
    invoiceDueDate: '',
    logo: null,
    qty: '',
    description: '',
    unitPrice: '',
    amount: '',
    tax: '',
    showTax: false,
  });

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInvoiceData({ ...invoiceData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          setInvoiceData({ ...invoiceData, logo: new Uint8Array(reader.result) });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          setInvoiceData({ ...invoiceData, logo: new Uint8Array(reader.result) });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const toggleTaxVisibility = () => {
    setInvoiceData({ ...invoiceData, showTax: !invoiceData.showTax });
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const { width, height } = page.getSize();
  
    // Starting Y-offset for text rendering
    let yOffset = height - 100;
  
    // Print logo if uploaded
    if (invoiceData.logo) {
      const logoImage = await pdfDoc.embedPng(invoiceData.logo);
      page.drawImage(logoImage, {
        x: width - 150,
        y: yOffset,
        width: 80,
        height: 80,
      });
    }
  
    yOffset -= 50; // Offset below the logo
  
    // Helper function to draw multi-line text
    const drawMultilineText = (text, x, y) => {
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        page.drawText(line, { x, y: y - index * 15, size: 12, color: rgb(0, 0, 0) });
      });
    };
  
    // "From" section
    page.drawText('From:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.from, 50, yOffset - 20);
  
    // Adjust Y-offset for the next field
    yOffset -= 60;
  
    // "Bill To" section
    page.drawText('Bill To:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.billTo, 50, yOffset - 20);
  
    yOffset -= 60;
  
    // "Ship To" section
    page.drawText('Ship To:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.shipTo, 50, yOffset - 20);
  
    yOffset -= 60;
  
    // Print invoice details (right side)
    page.drawText('Invoice #: ' + invoiceData.invoiceNumber, {
      x: width - 150,
      y: height - 140,
      size: 12,
      color: rgb(0, 0, 0),
    });
  
    page.drawText('Invoice Date: ' + invoiceData.invoiceDate, {
      x: width - 150,
      y: height - 180,
      size: 12,
      color: rgb(0, 0, 0),
    });
  
    page.drawText('P.O. #: ' + invoiceData.poNumber, {
      x: width - 150,
      y: height - 220,
      size: 12,
      color: rgb(0, 0, 0),
    });
  
    page.drawText('Invoice Due Date: ' + invoiceData.invoiceDueDate, {
      x: width - 150,
      y: height - 260,
      size: 12,
      color: rgb(0, 0, 0),
    });
  
    // Additional fields for items
    yOffset -= 60;
  
    // Draw fields for items
    page.drawText('Qty', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Description', { x: 100, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Unit Price', { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Amount', { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });
  
    yOffset -= 30; // Adjust Y-offset for the next line
  
    page.drawText(invoiceData.qty, { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.description, 100, yOffset - 20);
    page.drawText(invoiceData.unitPrice, { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText(invoiceData.amount, { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });
  
    if (invoiceData.showTax) {
      yOffset -= 60; // Space for Tax field
      page.drawText('Tax: ' + invoiceData.tax, { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    }
  
    // Save and generate PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="p-4 flex flex-col space-y-4">
      {/* Custom Ad Component */}
      <div className="mb-4">
        <CustomAd /> {/* Include your custom ad component here */}
      </div>

      {/* From and Logo Section */}
      <div className="flex flex-row space-x-4">
        <div className="flex-1 mr-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">From</label>
            <textarea
              name="from"
              value={invoiceData.from}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Your company name or address"
              style={{ height: '100px', resize: 'none', maxWidth: '350px' }}
            />
          </div>
        </div>
        <div className="flex-none" style={{ maxWidth: '350px' }}>
          <div
            className="border border-gray-300 rounded-md p-4 text-center mb-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="mt-2 text-gray-500">Drag and drop a PNG file or click to select one.</p>
          </div>
        </div>
      </div>

      {/* Bill To, Ship To, Invoice Details */}
      <div className="flex flex-row space-x-4">
        <div className="flex-1 mr-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bill To</label>
            <textarea
              name="billTo"
              value={invoiceData.billTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Customer billing address"
              style={{ height: '100px', resize: 'none', maxWidth: '350px' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ship To</label>
            <textarea
              name="shipTo"
              value={invoiceData.shipTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Customer shipping address"
              style={{ height: '100px', resize: 'none', maxWidth: '350px' }}
            />
          </div>
        </div>
        <div className="flex-none w-1/4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Invoice #</label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="text"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">P.O. #</label>
            <input
              type="text"
              name="poNumber"
              value={invoiceData.poNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Invoice Due Date</label>
            <input
              type="text"
              name="invoiceDueDate"
              value={invoiceData.invoiceDueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Items and Tax Section */}
      <div className="flex flex-row space-x-4">
        <div className="flex-1">
          <div className="flex flex-row space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Qty</label>
              <input
                type="text"
                name="qty"
                value={invoiceData.qty}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={invoiceData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                style={{ height: '100px', resize: 'vertical' }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="text"
                name="unitPrice"
                value={invoiceData.unitPrice}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="text"
                name="amount"
                value={invoiceData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          {invoiceData.showTax && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tax</label>
              <input
                type="text"
                name="tax"
                value={invoiceData.tax}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="flex-none">
          <button
            type="button"
            onClick={toggleTaxVisibility}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            {invoiceData.showTax ? 'Hide Tax' : 'Show Tax'}
          </button>
        </div>
      </div>

      {/* Generate PDF Button */}
      <button
        onClick={generatePDF}
        className="self-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
      >
        Generate PDF
      </button>
    </div>
  );
};

// Example CustomAd component
const CustomAd = () => (
  <div className="ad-container">
    <img src="your-ad-image-url.jpg" alt="Advertisement" className="w-full" />
  </div>
);

export default InvoiceComponent;
