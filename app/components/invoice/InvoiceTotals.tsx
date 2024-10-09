import React from 'react';
import InputField from '@/app/components/invoice/InputField';

interface InvoiceTotalsProps {
    subtotal?: number;
    total?: number;
    currency: string;
    currencySymbol: string;
    currencyList: { code: string; name: string }[];
    onCurrencyChange: (currencyCode: string) => void;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
                                                         subtotal,
                                                         total,
                                                         currency,
                                                         currencySymbol,
                                                         currencyList,
                                                         onCurrencyChange,
                                                     }) => {
    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Totals:</h3>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Currency:</label>
                <select
                    value={currency}
                    onChange={(e) => onCurrencyChange(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {currencyList.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                            {curr.name} ({curr.code})
                        </option>
                    ))}
                </select>
            </div>
            <InputField
                label="Subtotal"
                name="subtotal"
                value={`${currencySymbol}${subtotal?.toFixed(2)}`}
                onChange={() => {}}
            />
            <InputField
                label="Total"
                name="total"
                value={`${currencySymbol}${total?.toFixed(2)}`}
                onChange={() => {}}
            />
        </div>
    );
};

export default InvoiceTotals;
