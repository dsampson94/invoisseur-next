// useInvoiceForm.ts

import { useState, useEffect, ChangeEvent } from 'react';
import currencyCodes from 'currency-codes';
import currencySymbolMap from 'currency-symbol-map';

// Updated ItemData interface
interface ItemData {
    hours?: string;
    description?: string;
    hourlyRate?: string;
    amount?: string;
}

// Updated InvoiceData interface
interface InvoiceData {
    from: {
        postalAddress?: string;
        physicalAddress?: string;
        idNumber?: string;
        tel?: string;
        cell?: string;
        email?: string;
        taxNo?: string;
    };
    invoiceDate?: string;
    invoiceNumber?: string;
    logo?: string | null;
    to: {
        name?: string;
        vatRegNo?: string;
        coRegNo?: string;
        postalAddress?: string;
        tel?: string;
        fax?: string;
    };
    items: ItemData[];
    subtotal?: number;
    total?: number;
    bankDetails: {
        accountHolder?: string;
        bank?: string;
        accountNumber?: string;
        branchNumber?: string;
        accountType?: string;
    };
    termsConditions?: string;
}

export const useInvoiceForm = () => {
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');

    // Initialize invoice data with the updated structure
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        from: {
            postalAddress: '',
            physicalAddress: '',
            idNumber: '',
            tel: '',
            cell: '',
            email: '',
            taxNo: '',
        },
        invoiceDate: '',
        invoiceNumber: '',
        logo: null,
        to: {
            name: '',
            vatRegNo: '',
            coRegNo: '',
            postalAddress: '',
            tel: '',
            fax: '',
        },
        items: [
            {
                hours: '',
                description: '',
                hourlyRate: '',
                amount: '',
            },
        ],
        subtotal: 0,
        total: 0,
        bankDetails: {
            accountHolder: '',
            bank: '',
            accountNumber: '',
            branchNumber: '',
            accountType: '',
        },
        termsConditions: '',
    });

    const [termsConditions, setTermsConditions] = useState('');

    // Get the list of all currencies
    const currencyList = currencyCodes.data.map((currency) => ({
        code: currency.code,
        name: currency.currency,
    }));

    // Calculate subtotal and total
    const calculateTotals = () => {
        let subtotal = 0;

        const updatedItems = invoiceData.items.map((item) => {
            const hours = parseFloat(item.hours || '0');
            const hourlyRate = parseFloat(item.hourlyRate || '0');
            const amount = hours * hourlyRate;
            const amountStr = amount.toFixed(2);

            subtotal += amount;

            return {
                ...item,
                amount: amountStr,
            };
        });

        setInvoiceData((prevData) => ({
            ...prevData,
            items: updatedItems,
            subtotal,
            total: subtotal,
        }));
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceData.items]);

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

    // Handle changes in nested invoice data fields
    const handleInvoiceDataChange = (
        section: 'from' | 'to' | 'bankDetails',
        field: string,
        value: string
    ) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            },
        }));
    };

    // Handle changes in top-level invoice data fields
    const handleTopLevelChange = (field: string, value: string | null) => {
        setInvoiceData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Handle file uploads (logo)
    const handleFileChangeOrDrop = (file: File | null, field: 'logo') => {
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
                    hours: '',
                    description: '',
                    hourlyRate: '',
                    amount: '',
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

    return {
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
    };
};
