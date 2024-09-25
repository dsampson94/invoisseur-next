// Sender Information
export interface FromData {
    name?: string;
    postalAddress?: string;
    physicalAddress?: string;
    idNumber?: string;
    tel?: string;
    cell?: string;
    email?: string;
    taxNo?: string;
}

// Recipient Information
export interface ToData {
    name?: string;
    vatRegNo?: string;
    coRegNo?: string;
    postalAddress?: string;
    tel?: string;
    fax?: string;
    email?: string;
    contactPerson?: string;
}

// Bank Details
export interface BankDetails {
    accountHolder?: string;
    bank?: string;
    accountNumber?: string;
    branchNumber?: string;
    accountType?: string;
    swiftCode?: string;
    iban?: string;
}

// Item Data
export interface ItemData {
    hours?: string;
    description?: string;
    hourlyRate?: string;
    amount?: string;
    isAmountManual?: boolean;
}

// Invoice Data
export interface InvoiceData {
    from: FromData;
    to: ToData;
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    paymentTerms?: string; // e.g., 'Net 30 days'
    currency?: string;     // e.g., 'USD', 'EUR'
    poNumber?: string;     // Purchase Order Number
    items: ItemData[];
    subtotal?: number;
    tax?: number;
    discounts?: number;
    shipping?: number;
    total?: number;
    bankDetails: BankDetails;
    logo?: string | null;
    termsConditions?: string;
    notes?: string;
    status?: string; // e.g., 'Paid', 'Unpaid', 'Overdue'
}

// Currency Interface
export interface Currency {
    code: string;
    symbol: string;
    name: string;
}

// Currency Utility Interface (Optional)
export interface CurrencyUtility {
    formatCurrency: (amount: number, currencyCode: string) => string;
    getCurrencySymbol: (currencyCode: string) => string;
}
