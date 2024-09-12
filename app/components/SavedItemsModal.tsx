import React, { useState } from 'react';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: any) => void;
}

const SavedItemsModal: React.FC<SavedItemsModalProps> = ({ isOpen, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState<any[]>([]); // Replace with actual type

  const handleSearch = () => {
    // Perform search on saved items
    // For example, fetch from local storage or an API
  };

  const handleSelectItem = (item: any) => {
    onSelectItem(item);
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Select Saved Item</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved items..."
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
          <ul className="mt-4">
            {savedItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                <span>{item.description}</span>
                <button
                  onClick={() => handleSelectItem(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedItemsModal;
