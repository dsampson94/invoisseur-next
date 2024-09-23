// Signature.tsx
import React, { ChangeEvent } from 'react';

interface SignatureProps {
    signature: string | null;
    onChange: (file: File | null) => void;
    className?: string;
    style?: React.CSSProperties;
}

const Signature: React.FC<SignatureProps> = ({ signature, onChange, className, style }) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div className={className} style={style}>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
            {signature && (
                <img src={signature} alt="Signature" style={{ width: '100px', height: '50px', marginTop: '10px' }} />
            )}
        </div>
    );
};

export default Signature;
