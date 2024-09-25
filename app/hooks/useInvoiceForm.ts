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
    isAmountManual?: boolean;
}

// Updated InvoiceData interface
interface InvoiceData {
    from: {
        name?: string;
        physicalAddress?: string;
        idNumber?: string;
        tel?: string;
        cell?: string;
        email?: string;
        taxNo?: string;
    };
    to: {
        name?: string;
        postalAddress?: string;
        vatRegNo?: string;
        coRegNo?: string;
        tel?: string;
        fax?: string;
        email?: string;
        contactPerson?: string;
    };
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    paymentTerms?: string;
    currency?: string;
    poNumber?: string;
    items: ItemData[];
    subtotal?: number;
    tax?: number;
    discounts?: number;
    shipping?: number;
    total?: number;
    bankDetails: {
        accountHolder?: string;
        bank?: string;
        accountNumber?: string;
        branchNumber?: string;
        accountType?: string;
        swiftCode?: string;
        iban?: string;
    };
    logo?: string | null;
    termsConditions?: string;
    notes?: string;
}
export const useInvoiceForm = () => {
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');

    // Initialize invoice data with the updated structure
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        from: {
            name: '',
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
        const subtotal = invoiceData.items.reduce((sum, item) => {
            const amount = parseFloat(item.amount || '0');
            return sum + amount;
        }, 0);

        setInvoiceData((prevData) => ({
            ...prevData,
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
        const field = event.target.name as keyof ItemData;
        let value = event.target.value;

        if (
            (field === 'hours' || field === 'hourlyRate' || field === 'amount') &&
            isNaN(Number(value))
        ) {
            value = '0';
        }

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };

        // If amount is manually changed, set isAmountManual to true
        if (field === 'amount') {
            updatedItems[index].isAmountManual = true;
        } else if (field === 'hours' || field === 'hourlyRate') {
            // If hours or hourlyRate change and amount is not manually set, recalculate amount
            if (!updatedItems[index].isAmountManual) {
                const hours = parseFloat(updatedItems[index].hours || '0');
                const hourlyRate = parseFloat(updatedItems[index].hourlyRate || '0');
                const amount = hours * hourlyRate;
                updatedItems[index].amount = amount.toFixed(2);
            }
        }

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
