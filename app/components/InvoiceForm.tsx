"use client";

import React, { useState, ChangeEvent, DragEvent, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import TaxModal from './TaxModal'; // Adjust the import path as necessary
import SavedItemsModal from './SavedItemsModal'; // Add import for SavedItemsModal

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
  invoiceDueDate: string;
  logo: Uint8Array | null;
  items: ItemData[];
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
    items: [{
      qty: '',
      description: '',
      unitPrice: '',
      amount: '',
      taxName: '',
      taxPercentage: '',
      showTax: false,
    }],
    showTax: false,
  });

  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isSavedItemsModalOpen, setIsSavedItemsModalOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    invoiceData.items.forEach(item => {
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
  }, [invoiceData.items]);

  const handleChange = (index: number, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][event.target.name] = event.target.value;
    setInvoiceData({ ...invoiceData, items: updatedItems });
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

  const openTaxModal = () => {
    setIsTaxModalOpen(true);
  };

  const closeTaxModal = () => {
    setIsTaxModalOpen(false);
  };

  const saveTaxDetails = (index: number, taxName: string, taxPercentage: string) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = { ...updatedItems[index], taxName, taxPercentage, showTax: true };
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const removeItem = (index: number) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  const addNewItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { qty: '', description: '', unitPrice: '', amount: '', taxName: '', taxPercentage: '', showTax: false }
      ],
    });
  };

  const openSavedItemsModal = () => {
    setIsSavedItemsModalOpen(true);
  };

  const closeSavedItemsModal = () => {
    setIsSavedItemsModalOpen(false);
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const { width, height } = page.getSize();

    let yOffset = height - 100;

    if (invoiceData.logo) {
      const logoImage = await pdfDoc.embedPng(invoiceData.logo);
      page.drawImage(logoImage, {
        x: width - 150,
        y: yOffset,
        width: 80,
        height: 80,
      });
    }

    yOffset -= 50;

    const drawMultilineText = (text: string, x: number, y: number) => {
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        page.drawText(line, { x, y: y - index * 15, size: 12, color: rgb(0, 0, 0) });
      });
    };

    page.drawText('From:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.from, 50, yOffset - 20);

    yOffset -= 60;

    page.drawText('Bill To:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.billTo, 50, yOffset - 20);

    yOffset -= 60;

    page.drawText('Ship To:', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    drawMultilineText(invoiceData.shipTo, 50, yOffset - 20);

    yOffset -= 60;

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

    yOffset -= 60;

    // Draw headers
    page.drawText('Qty', { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Description', { x: 100, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Unit Price', { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Amount', { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    page.drawText('Tax', { x: 520, y: yOffset, size: 12, color: rgb(0, 0, 0) });

    yOffset -= 30;

    // Draw item details
    invoiceData.items.forEach(item => {
      page.drawText(item.qty, { x: 50, y: yOffset, size: 12, color: rgb(0, 0, 0) });
      drawMultilineText(item.description, 100, yOffset - 20);
      page.drawText(item.unitPrice, { x: 300, y: yOffset, size: 12, color: rgb(0, 0, 0) });
      page.drawText(item.amount, { x: 450, y: yOffset, size: 12, color: rgb(0, 0, 0) });
      if (item.showTax) {
        page.drawText(item.taxPercentage + '%', { x: 520, y: yOffset, size: 12, color: rgb(0, 0, 0) });
      }

      yOffset -= 50;
    });

    // Draw subtotal, VAT, and total
    page.drawText(`Subtotal: $${subtotal.toFixed(2)}`, { x: 400, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    yOffset -= 20;
    page.drawText(`VAT: $${vat.toFixed(2)}`, { x: 400, y: yOffset, size: 12, color: rgb(0, 0, 0) });
    yOffset -= 20;
    page.drawText(`Total: $${total.toFixed(2)}`, { x: 400, y: yOffset, size: 12, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex flex-row space-x-4">
        <div className="flex-1 mr-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">From</label>
            <textarea
              name="from"
              value={invoiceData.from}
              onChange={(e) => setInvoiceData({ ...invoiceData, from: e.target.value })}
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

      <div className="flex flex-row space-x-4">
        <div className="flex-1 mr-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bill To</label>
            <textarea
              name="billTo"
              value={invoiceData.billTo}
              onChange={(e) => setInvoiceData({ ...invoiceData, billTo: e.target.value })}
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
              onChange={(e) => setInvoiceData({ ...invoiceData, shipTo: e.target.value })}
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
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="text"
              name="invoiceDate"
              value={invoiceData.invoiceDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">P.O. #</label>
            <input
              type="text"
              name="poNumber"
              value={invoiceData.poNumber}
              onChange={(e) => setInvoiceData({ ...invoiceData, poNumber: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Invoice Due Date</label>
            <input
              type="text"
              name="invoiceDueDate"
              value={invoiceData.invoiceDueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDueDate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {invoiceData.items.map((item, index) => (
        <div key={index} className="flex flex-row space-x-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-row items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Qty</label>
                <input
                  type="text"
                  name="qty"
                  value={item.qty}
                  onChange={(e) => handleChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  style={{ height: '100px', resize: 'vertical' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="text"
                  name="unitPrice"
                  value={item.unitPrice}
                  onChange={(e) => handleChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="text"
                  name="amount"
                  value={item.amount}
                  onChange={(e) => handleChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex-none">
                <button
                  type="button"
                  onClick={() => openTaxModal()}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  {item.taxName ? `${item.taxName} ${item.taxPercentage}%` : 'Add Tax'}
                </button>
              </div>
              <div className="flex-none">
                <button
                  type="button"
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  title="Remove Item"
                  onClick={() => removeItem(index)}
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-row justify-between mt-4">
        <div className="flex flex-row space-x-1">
          <button
            onClick={addNewItem}
            className="px-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Item
          </button>
          <button
            onClick={openSavedItemsModal}
            className="px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Saved Items
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-lg font-medium">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="text-lg font-medium">VAT: ${vat.toFixed(2)}</p>
          <p className="text-lg font-medium">Total: ${total.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="self-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
      >
        Generate PDF
      </button>

      <TaxModal
        isOpen={isTaxModalOpen}
        onClose={closeTaxModal}
        onSave={(taxName, taxPercentage) => saveTaxDetails(invoiceData.items.length - 1, taxName, taxPercentage)}
      />

      <SavedItemsModal
        isOpen={isSavedItemsModalOpen}
        onClose={closeSavedItemsModal}
        onSelectItem={(item) => {
          // Handle selecting saved item
        }}
      />
    </div>
  );
};

export default InvoiceComponent;