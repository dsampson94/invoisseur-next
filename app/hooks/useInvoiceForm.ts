import { useState } from 'react';

/**
 * useInvoiceForm Hook
 * This hook manages the state and logic for handling invoice data in a form.
 * It provides functions for handling input changes, adding new items, and calculating the total amount.
 */
export const useInvoiceForm = () => {
  // State for storing invoice data, including general information and line items
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
    items: [{ name: '', amount: 0 }], // Array of items, each with a name and amount
    total: 0 // Total amount of the invoice
  });

  /**
   * handleInputChange Function
   * Handles changes to form inputs, updating the corresponding state.
   * @param e - The event triggered by input change
   * @param index - Optional index for handling changes to specific line items
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      // If an index is provided, update the specific item in the items array
      const items = [...invoiceData.items];
      items[index][name] = value;
      setInvoiceData({ ...invoiceData, items });
    } else {
      // Otherwise, update the general invoice data
      setInvoiceData({ ...invoiceData, [name]: value });
    }
  };

  /**
   * handleAddItem Function
   * Adds a new blank item to the invoice items array.
   */
  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { name: '', amount: 0 }]
    });
  };

  /**
   * handleCalculateTotal Function
   * Calculates the total amount for the invoice by summing up the amounts of all items.
   */
  const handleCalculateTotal = () => {
    const total = invoiceData.items.reduce((acc, item) => acc + parseFloat(item.amount || '0'), 0);
    setInvoiceData({ ...invoiceData, total });
  };

  return {
    invoiceData,            // The current state of the invoice data
    handleInputChange,      // Function to handle changes to input fields
    handleAddItem,          // Function to add a new item to the invoice
    handleCalculateTotal    // Function to calculate the total invoice amount
  };
};
