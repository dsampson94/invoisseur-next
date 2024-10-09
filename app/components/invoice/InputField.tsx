// InputField.tsx

import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    type?: string;
    rows?: number;
    style?: React.CSSProperties;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   name,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   type = 'text',
                                                   rows,
                                                   style,
                                               }) => (
    <div className="mb-4" style={style}>
        {type === 'textarea' ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        )}
    </div>
);

export default InputField;
