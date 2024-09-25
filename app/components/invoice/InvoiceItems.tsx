import React from 'react';
import InputField from '@/app/components/invoice/InputField';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons

interface ItemData {
    hours?: string;
    description?: string;
    hourlyRate?: string;
    amount?: string;
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
                <div key={index} className="border p-4 mb-4 rounded-md">
                    <InputField
                        label="Hours"
                        name="hours"
                        value={item.hours || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Hours"
                        type="number"
                    />
                    <InputField
                        label="Detailed Description"
                        name="description"
                        value={item.description || ''}
                        onChange={(e) => onItemChange(index, e)}
                        placeholder="Description"
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
                    <div className="flex justify-end">
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
