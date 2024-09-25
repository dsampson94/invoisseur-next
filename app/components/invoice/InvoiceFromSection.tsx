import React from 'react';
import InputField from '@/app/components/invoice/InputField';

interface FromData {
    postalAddress?: string;
    physicalAddress?: string;
    idNumber?: string;
    tel?: string;
    cell?: string;
    email?: string;
    taxNo?: string;
}

interface InvoiceHeaderProps {
    from: FromData;
    onFromChange: (
        section: 'from',
        field: string,
        value: string
    ) => void;
}

const InvoiceFromSection: React.FC<InvoiceHeaderProps> = ({
                                                         from,
                                                         onFromChange,
                                                     }) => {
    // Local handler to pass the field and value
    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onFromChange('from', field, event.target.value);
    };

    return (
        <div className="flex flex-col space-y-2 w-1/2">
            <h3 className="text-xl font-bold mb-2">FROM:</h3>
            <InputField
                label="Physical Address"
                name="physicalAddress"
                value={from.physicalAddress || ''}
                onChange={handleChange('physicalAddress')}
                placeholder="Physical Address"
            />
            <InputField
                label="ID Number"
                name="idNumber"
                value={from.idNumber || ''}
                onChange={handleChange('idNumber')}
                placeholder="ID Number"
            />
            <InputField
                label="Tel"
                name="tel"
                value={from.tel || ''}
                onChange={handleChange('tel')}
                placeholder="Telephone Number"
            />
            <InputField
                label="Cell"
                name="cell"
                value={from.cell || ''}
                onChange={handleChange('cell')}
                placeholder="Cell Number"
            />
            <InputField
                label="Email"
                name="email"
                value={from.email || ''}
                onChange={handleChange('email')}
                placeholder="Email Address"
            />
            <InputField
                label="Tax No"
                name="taxNo"
                value={from.taxNo || ''}
                onChange={handleChange('taxNo')}
                placeholder="Tax Number"
            />
        </div>
    );
};

export default InvoiceFromSection;
