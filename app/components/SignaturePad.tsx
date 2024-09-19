// SignaturePad.tsx
import React from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad: React.FC<{ onSave: (dataURL: string) => void }> = ({ onSave }) => {
  const sigCanvas = React.useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave(dataURL); 
    }
  };

  return (
    <div>
      <h2>Draw your eSignature here</h2>
      <SignatureCanvas
        ref={sigCanvas}
        penColor='black'
        canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
      />
      <button onClick={clear}>Clear</button>
      <button onClick={save}>Save</button>
    </div>
  );
};

export default SignaturePad;
