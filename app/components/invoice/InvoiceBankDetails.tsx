// InvoiceBankDetails.tsx

import React from 'react';
import InputField from '@/app/components/invoice/InputField';

interface BankDetails {
    accountHolder?: string;
    bank?: string;
    accountNumber?: string;
    branchNumber?: string;
    accountType?: string;
}

interface InvoiceBankDetailsProps {
    bankDetails: BankDetails;
    onBankDetailsChange: (
        section: 'bankDetails',
        field: string,
        value: string
    ) => void;
}

const InvoiceBankDetails: React.FC<InvoiceBankDetailsProps> = ({
                                                                   bankDetails,
                                                                   onBankDetailsChange,
                                                               }) => {
    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onBankDetailsChange('bankDetails', field, event.target.value);
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Your Banking Details:</h3>
            <InputField
                label="Account Holder"
                name="accountHolder"
                value={bankDetails.accountHolder || ''}
                onChange={handleChange('accountHolder')}
                placeholder="Account Holder"
            />
            <InputField
                label="Bank"
                name="bank"
                value={bankDetails.bank || ''}
                onChange={handleChange('bank')}
                placeholder="Bank"
            />
            <InputField
                label="Account Number"
                name="accountNumber"
                value={bankDetails.accountNumber || ''}
                onChange={handleChange('accountNumber')}
                placeholder="Account Number"
            />
            <InputField
                label="Branch Number"
                name="branchNumber"
                value={bankDetails.branchNumber || ''}
                onChange={handleChange('branchNumber')}
                placeholder="Branch Number"
            />
            <InputField
                label="Type of Account"
                name="accountType"
                value={bankDetails.accountType || ''}
                onChange={handleChange('accountType')}
                placeholder="Type of Account"
            />
        </div>
    );
};

export default InvoiceBankDetails;
