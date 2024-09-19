import React from 'react';

interface TermsConditionsProps {
  terms: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ terms, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
      <textarea
        name="terms"
        value={terms}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        placeholder="Add terms and conditions here"
        style={{ height: '100px', resize: 'vertical' }}
      />
    </div>
  );
};

export default TermsConditions;
