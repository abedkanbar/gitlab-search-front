import React, { createContext, useState, FC } from 'react';

type ToastContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  variant: 'success' | 'info' | 'warning' | 'error';
  openToast: (message: string, variant: 'success' | 'info' | 'warning' | 'error', error?: any) => void;

};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const openToast = (message: string, variant: 'success' | 'info' | 'warning' | 'error', error?: any) => {
    if(error !== undefined) console.log(error);
    var msg = message;
    if(error?.detail){
     msg += `\n${error.detail}`;
    }
    setMessage(msg);
    setVariant(variant);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ open, setOpen, message, variant, openToast }}>
      {children}
    </ToastContext.Provider>
  );
};