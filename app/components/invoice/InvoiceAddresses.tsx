import React, { ChangeEvent } from 'react';
import InputField from '@/app/components/invoice/InputField';

interface InvoiceAddressesProps {
    billTo: string;
    shipTo: string;
    onBillToChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onShipToChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InvoiceAddresses: React.FC<InvoiceAddressesProps> = ({
                                                               billTo,
                                                               shipTo,
                                                               onBillToChange,
                                                               onShipToChange,
                                                           }) => {
    return (
        <div className="flex-1">
            {/* Bill To Section */}
            <InputField
                label="Bill To"
                name="billTo"
                value={billTo}
                onChange={onBillToChange}
                placeholder="Customer billing address"
                rows={4}
                type="textarea"
                style={{ maxWidth: '520px' }}
            />

            {/* Ship To Section */}
            <InputField
                label="Ship To"
                name="shipTo"
                value={shipTo}
                onChange={onShipToChange}
                placeholder="Customer shipping address (Optional)"
                rows={4}
                type="textarea"
                style={{ maxWidth: '520px' }}
            />
        </div>
    );
};

export default InvoiceAddresses;
