declare module 'react-signature-canvas' {
    import * as React from 'react';
  
    interface SignatureCanvasProps {
      penColor?: string;
      canvasProps?: React.HTMLProps<HTMLCanvasElement>;
      onEnd?: () => void;
      onBegin?: () => void;
    }
  
    export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
      clear(): void;
      toDataURL(): string;
    }
  }
  