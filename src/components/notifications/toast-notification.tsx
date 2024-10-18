import React, { useContext, FC } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/lab/Alert';
import { ToastContext } from '../../toast-provider';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ToastNotification: FC = () => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error('MyComponent must be used within a ToastProvider');
  }

  const { open, setOpen, message, variant } = toastContext;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ marginTop: '50px' }} >
      <Alert onClose={handleClose} severity={variant}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;