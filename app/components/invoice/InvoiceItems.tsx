// InvoiceItems.tsx

import React from 'react';
import InputField from '@/app/components/invoice/InputField';
import { FaTrash } from 'react-icons/fa';

interface ItemData {
    hours?: string;
    description?: string;
    hourlyRate?: string;
    amount?: string;
    isAmountManual?: boolean;
}

interface InvoiceItemsProps {
    items: ItemData[];
    onItemChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onRemoveItem: (index: number) => void;
    onAddNewItem: () => void;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
                                                       items,
                                                       onItemChange,
                                                       onRemoveItem,
                                                       onAddNewItem,
                                                   }) => {
    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Items:</h3>
            {items.map((item, index) => (
                <div key={index} className="border mb-4 flex space-x-2 flex-row rounded-md">
                    <InputField
                        label="Detailed Description"
                        name="description"
                        value={item.description || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Description"
                    />
                    <InputField
                        label="Hours"
                        name="hours"
                        value={item.hours || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Hours"
                        type="number"
                    />
                    <InputField
                        label="Hourly Rate"
                        name="hourlyRate"
                        value={item.hourlyRate || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Hourly Rate"
                        type="number"
                    />
                    <InputField
                        label="Amount"
                        name="amount"
                        value={item.amount || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Amount"
                        type="number"
                    />
                    <div className="flex justify-end h-9 mt-0.5">
                        <button
                            onClick={() => onRemoveItem(index)}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                            aria-label="Remove Item"
                        >
                            <FaTrash className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
            <button
                onClick={onAddNewItem}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600"
            >
                Add Item
            </button>
        </div>
    );
};

export default InvoiceItems;
