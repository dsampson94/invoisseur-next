import React, { useState } from 'react';

interface ItemData {
  qty: string;
  description: string;
  unitPrice: string;
  amount: string;
  taxName: string;
  taxPercentage: string;
  showTax: boolean;
}

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItems: (items: ItemData[]) => void;
  savedItems: ItemData[];
}

const SavedItemsModal: React.FC<SavedItemsModalProps> = ({ isOpen, onClose, onSelectItems, savedItems }) => {
  const [selectedItems, setSelectedItems] = useState<ItemData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleItemSelect = (item: ItemData) => {
    setSelectedItems(prevSelected =>
      prevSelected.some(selectedItem => selectedItem.description === item.description)
        ? prevSelected.filter(selectedItem => selectedItem.description !== item.description)
        : [...prevSelected, item]
    );
  };

  const handleAddSelectedItems = () => {
    onSelectItems(selectedItems);
    onClose();
  };

  // Filter items based on search term and ensure item is valid
  const filteredItems = savedItems.filter(item => 
    item && item.description && item.description.toLowerCase().includes(searchTerm)
  );

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-3/4 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Items to Add</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 font-bold">Close</button>
        </div>
        <input
          type="text"
          placeholder="Search items..."
          className="w-full px-2 py-1 border border-gray-300 rounded mb-4"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredItems.length === 0 ? (
            <p>No items found</p>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.description}
                className={`flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer ${selectedItems.some(selectedItem => selectedItem.description === item.description) ? 'bg-blue-100' : ''}`}
                onClick={() => handleItemSelect(item)}
              >
                <div className="flex-1">
                  {item.description} - {item.amount}
                </div>
                <span className={`w-4 h-4 rounded-full border ${selectedItems.some(selectedItem => selectedItem.description === item.description) ? 'bg-blue-500' : ''}`}></span>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleAddSelectedItems}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Selected Items
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SavedItemsModal;
