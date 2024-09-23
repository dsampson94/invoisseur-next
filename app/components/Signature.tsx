import React, { useRef } from 'react';

interface SignatureProps {
  signature: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; 
  style?: React.CSSProperties;
}

const Signature: React.FC<SignatureProps> = ({ signature, onChange, className, style }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className} style={style}>
      {signature && (
        <img 
          src={URL.createObjectURL(signature)} 
          alt="Signature" 
          className="mt-2 mb-2 w-full h-24 object-contain" 
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="block w-full"
        ref={inputRef}
      />
    </div>
  );
};

export default Signature;
