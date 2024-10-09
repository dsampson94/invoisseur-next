import React from 'react';
import InputField from '@/app/components/invoice/InputField';

interface InvoiceToSectionProps {
    to: {
        name?: string;
        vatRegNo?: string;
        coRegNo?: string;
        postalAddress?: string;
        tel?: string;
        fax?: string;
    };
    onToChange: (
        section: 'to',
        field: string,
        value: string
    ) => void;
}

const InvoiceToSection: React.FC<InvoiceToSectionProps> = ({ to, onToChange }) => {
    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onToChange('to', field, event.target.value);
    };

    return (
        <div className="flex flex-col space-y-2 w-1/2">
            <h3 className="text-xl font-bold mb-2">TO:</h3>
            <InputField
                label="Name"
                name="name"
                value={to.name || ''}
                onChange={handleChange('name')}
                placeholder="Recipient Name"
            />
            <InputField
                label="VAT Reg No"
                name="vatRegNo"
                value={to.vatRegNo || ''}
                onChange={handleChange('vatRegNo')}
                placeholder="VAT Registration Number"
            />
            <InputField
                label="CO Reg No"
                name="coRegNo"
                value={to.coRegNo || ''}
                onChange={handleChange('coRegNo')}
                placeholder="Company Registration Number"
            />
            <InputField
                label="Postal Address"
                name="postalAddress"
                value={to.postalAddress || ''}
                onChange={handleChange('postalAddress')}
                placeholder="Postal Address"
            />
            <InputField
                label="Tel"
                name="tel"
                value={to.tel || ''}
                onChange={handleChange('tel')}
                placeholder="Telephone Number"
            />
        </div>
    );
};

export default InvoiceToSection;
