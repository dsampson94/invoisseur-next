
"use client";

import React, { useState, ChangeEvent } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

type InvoiceItem = {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type InvoiceData = {
  invoiceNumber: string;
  date: string;
  from: string;
  billTo: string;
  shipTo: string;
  paymentTerms: string;
  dueDate: string;
  notes: string;
  lateFees: string;
  paymentMethods: string;
  deliverySchedule: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
};

const InvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    date: '',
    from: '',
    billTo: '',
    shipTo: '',
    paymentTerms: '',
    dueDate: '',
    notes: '',
    lateFees: '',
    paymentMethods: '',
    deliverySchedule: '',
    items: [{ name: '', description: '', quantity: 0, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [name]: name === 'quantity' || name === 'rate' ? parseFloat(value) : value,
    };
    newItems[index].amount =
      parseFloat(newItems[index].quantity.toString()) * parseFloat(newItems[index].rate.toString()) || 0;
    setInvoiceData((prevData) => ({
      ...prevData,
      items: newItems,
    }));
  };

  const addItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: '', description: '', quantity: 0, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((acc, item) => acc + item.amount, 0);
    const tax = (subtotal * invoiceData.tax) / 100;
    const discount = invoiceData.discount;
    const shipping = invoiceData.shipping;
    const total = subtotal + tax + shipping - discount;
    const amountPaid = invoiceData.amountPaid;
    const balanceDue = total - amountPaid;
  
    setInvoiceData((prevData) => ({
      ...prevData,
      subtotal,
      tax,
      discount,
      shipping,
      total,
      balanceDue,
    }));
  };  
  const generatePDF = async () => {
    calculateTotals();
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 850]);
  
    let yOffset = 800;
    const width = 600;
  
    const drawText = (text: string, x: number, y: number, size = 18, color = rgb(0, 0, 0)) => {
      page.drawText(text, { x, y, size, color });
    };
  
    // Draw header
    drawText('Invoice Number: ' + invoiceData.invoiceNumber, 50, yOffset);
    yOffset -= 30;
    drawText('Date: ' + invoiceData.date, 50, yOffset);
    yOffset -= 30;
    drawText('From: ' + invoiceData.from, 50, yOffset);
    yOffset -= 30;
    drawText('Bill To: ' + invoiceData.billTo, 50, yOffset);
    yOffset -= 30;
    drawText('Ship To: ' + invoiceData.shipTo, 50, yOffset);
    yOffset -= 30;
    drawText('Payment Terms: ' + invoiceData.paymentTerms, 50, yOffset);
    yOffset -= 30;
    drawText('Due Date: ' + invoiceData.dueDate, 50, yOffset);
    yOffset -= 30;
    drawText('Notes: ' + invoiceData.notes, 50, yOffset);
    yOffset -= 30;
    drawText('Late Fees: ' + invoiceData.lateFees, 50, yOffset);
    yOffset -= 30;
    drawText('Payment Methods: ' + invoiceData.paymentMethods, 50, yOffset);
    yOffset -= 30;
    drawText('Delivery Schedule: ' + invoiceData.deliverySchedule, 50, yOffset);
    yOffset -= 30;
  
    // Draw items table
    drawText('Items:', 50, yOffset);
    yOffset -= 30;
    invoiceData.items.forEach((item, index) => {
      drawText(`Item ${index + 1}: ${item.name}`, 50, yOffset);
      yOffset -= 30;
      drawText('Description: ' + item.description, 50, yOffset);
      yOffset -= 30;
      drawText(`Quantity: ${item.quantity}`, 50, yOffset);
      yOffset -= 30;
      drawText(`Rate: ${item.rate}`, 50, yOffset);
      yOffset -= 30;
      drawText(`Amount: ${item.amount}`, 50, yOffset);
      yOffset -= 30;
    });
  
    yOffset -= 20;
    drawText('Totals', 50, yOffset);
    yOffset -= 30;
    drawText('Subtotal:', 50, yOffset);
    drawText(Number(invoiceData.subtotal).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Tax (%):', 50, yOffset);
    drawText(Number(invoiceData.tax).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Discount:', 50, yOffset);
    drawText(Number(invoiceData.discount).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Shipping:', 50, yOffset);
    drawText(Number(invoiceData.shipping).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Total:', 50, yOffset);
    drawText(Number(invoiceData.total).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Amount Paid:', 50, yOffset);
    drawText(Number(invoiceData.amountPaid).toFixed(2), width - 150, yOffset);
    yOffset -= 30;
    drawText('Balance Due:', 50, yOffset);
    drawText(Number(invoiceData.balanceDue).toFixed(2), width - 150, yOffset);
  
    // Save the PDF
    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.pdf';
    link.click();
  };

  const addShipment = () => {
    // Add shipment logic (optional)
  };

  const addDiscount = () => {
    // Add discount logic (optional)
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">welcome to Invoice Generator</h1>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={invoiceData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
            <input
              type="text"
              name="paymentTerms"
              value={invoiceData.paymentTerms}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoiceData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              name="from"
              value={invoiceData.from}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill To</label>
            <input
              type="text"
              name="billTo"
              value={invoiceData.billTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ship To</label>
            <input
              type="text"
              name="shipTo"
              value={invoiceData.shipTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={invoiceData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Late Fees</label>
            <input
              type="number"
              name="lateFees"
              value={invoiceData.lateFees}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Methods</label>
            <input
              type="text"
              name="paymentMethods"
              value={invoiceData.paymentMethods}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Schedule</label>
            <input
              type="text"
              name="deliverySchedule"
              value={invoiceData.deliverySchedule}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="border-t border-gray-300 mt-4 pt-4">
          <h2 className="text-lg font-bold mb-2">Items</h2>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="border p-4 mb-2 rounded-md shadow-sm">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate</label>
                  <input
                    type="number"
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={item.amount}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  - Remove Item
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-col space-y-2 mt-4">
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
            <button
              type="button"
              onClick={addShipment}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              + Shipment
            </button>
            <button
              type="button"
              onClick={addDiscount}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              + Discount
            </button>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-4 pt-4">
          <h2 className="text-lg font-bold mb-2">Totals</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtotal</label>
              <input
                type="number"
                value={invoiceData.subtotal.toFixed(2)}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
              <input
                type="number"
                name="tax"
                value={invoiceData.tax}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount</label>
              <input
                type="number"
                name="discount"
                value={invoiceData.discount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping</label>
              <input
                type="number"
                name="shipping"
                value={invoiceData.shipping}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                value={invoiceData.total.toFixed(2)}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                value={invoiceData.amountPaid}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Balance Due</label>
              <input
                type="number"
                value={invoiceData.balanceDue.toFixed(2)}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={generatePDF}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
