// app/components/InvoiceForm.tsx
'use client'; // Add this directive to mark this as a Client Component

import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: '',
    dueDate: '',
    username: '',
    email: '',
    company: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [{ name: '', description: '', amount: 0 }],
    total: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({ ...prevData, [name]: value }));
  };

  const addItem = () => {
    setInvoiceData(prevData => ({
      ...prevData,
      items: [...prevData.items, { name: '', description: '', amount: 0 }]
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setInvoiceData(prevData => ({ ...prevData, items: newItems }));
  };

  const generatePDF = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Position invoice number and other details on the page
    page.drawText(`Invoice Number: ${invoiceData.invoiceNumber}`, {
      x: 50,
      y: height - 50,
      size: 24,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${invoiceData.date}`, {
      x: width - 250,
      y: height - 50,
      size: 24,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Due Date: ${invoiceData.dueDate}`, {
      x: width - 250,
      y: height - 80,
      size: 24,
      color: rgb(0, 0, 0),
    });

    let yOffset = height - 120;
    invoiceData.items.forEach((item, index) => {
      page.drawText(`Item ${index + 1}: ${item.name}`, {
        x: 50,
        y: yOffset,
        size: 18,
        color: rgb(0, 0, 0),
      });
      page.drawText(`Description: ${item.description}`, {
        x: 50,
        y: yOffset - 20,
        size: 18,
        color: rgb(0, 0, 0),
      });
      page.drawText(`Amount: ${item.amount.toFixed(2)}`, {
        x: 50,
        y: yOffset - 40,
        size: 18,
        color: rgb(0, 0, 0),
      });
      yOffset -= 80;
    });

    const pdfBytes = await doc.save();

    // Create a blob and download the file
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf';
    link.click();
  };

  return (
    <form className="space-y-4">
      <div className="flex justify-between">
        <div>
          <label className="block mb-2">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={invoiceData.date}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {invoiceData.items.map((item, index) => (
        <div key={index} className="mt-4">
          <label className="block mb-2">Item {index + 1} Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-2 w-full"
          />
          <label className="block mb-2 mt-2">Description</label>
          <input
            type="text"
            name="description"
            value={item.description}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-2 w-full"
          />
          <label className="block mb-2 mt-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={item.amount}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-2 w-full"
          />
        </div>
      ))}
      
      <div className="mt-4">
        <button
          type="button"
          onClick={generatePDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate PDF
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
